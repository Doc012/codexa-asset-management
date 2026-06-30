package backend.app.loan.service;

import backend.app.asset.enums.AssetStatus;
import backend.app.asset.model.Asset;
import backend.app.asset.repository.AssetRepo;
import backend.app.auditLog.enums.ActionType;
import backend.app.auditLog.enums.EntityType;
import backend.app.auditLog.model.AuditLog;
import backend.app.auditLog.service.AuditLogService;
import backend.app.loan.dto.LoanRequestDTO;
import backend.app.loan.dto.LoanResponseDTO;
import backend.app.loan.enums.LoanStatus;
import backend.app.loan.mapper.LoanMapper;
import backend.app.loan.model.Loan;
import backend.app.loan.repository.LoanRepo;
import backend.app.user.model.User;
import backend.app.user.repository.UserRepository;
import backend.auth.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LoanService {

    private final LoanRepo loanRepo;
    private final UserRepository userRepo;
    private final AssetRepo assetRepo;
    private final AuditLogService auditLogService;
    private final LoanMapper loanMapper;
    private final EmailService emailService;

    public LoanResponseDTO createLoan(LoanRequestDTO dto) {

        User user = userRepo.findById(dto.userId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "User not found"
                        )
                );

        Asset asset = assetRepo.findById(dto.assetId())
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Asset not found"
                        )
                );

        if (asset.getAssetStatus().equals(AssetStatus.LOANED)){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Asset is already loaned, request another asset.");
        } else if (asset.getAssetStatus().equals(AssetStatus.RETIRED)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Asset is no longer available");
        } else if (asset.getAssetStatus().equals(AssetStatus.AVAILABLE)) {
            Loan loan = new Loan();
            loan.setUser(user);
            loan.setAsset(asset);
            loan.setRequestDate(LocalDate.now());
            loan.setStatus(LoanStatus.PENDING);
            
//            loanRepo.save(loan);

            LoanResponseDTO createdLoan = loanMapper.toDTO(loanRepo.save(loan));

            AuditLog log = AuditLog.builder()
                    .entityType(EntityType.LOAN)
                    .entityId(createdLoan.loanId())
                    .userId(7L)
                    .actionType(ActionType.CREATE)
                    .oldValue("N/A")
                    .newValue(createdLoan.title())
                    .message(user.getFirstName() + "(" + user.getEmail() + "), sent a loan request.")
                    .build();

            auditLogService.createLog(log);



            return createdLoan;
        } else {
            throw new ResponseStatusException(
                    HttpStatus.UNPROCESSABLE_CONTENT,
                    "Invalid status.");
        }
    }

    public LoanResponseDTO getLoanById(Long id) {

        Loan loan = loanRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Loan with ID " + id + " not found"
                )
        );

        return loanMapper.toDTO(loan);

        

    }

    public List<LoanResponseDTO> getLoanByUser(Long userId) {
        return loanRepo.findByUser_UserIdOrderByRequestDateDesc(userId)
                .stream()
                .map(loanMapper::toDTO)
                .toList();
    }

    public List<LoanResponseDTO> getAllLoans() {
        return loanRepo.findAllByOrderByRequestDateDesc()
                .stream()
                .map(loanMapper::toDTO)
                .toList();
    }

    public List<LoanResponseDTO> getLoanByStatus(LoanStatus status) {
        return loanRepo.findByStatusOrderByRequestDateDesc(status)
                .stream()
                .map(loanMapper::toDTO)
                .toList();
    }

    public LoanResponseDTO cancelLoan(Long loanId){
        Loan loan = getEntity(loanId);
        loan.setStatus(LoanStatus.CANCELLED);
//        loan.getAsset().setAssetStatus(AssetStatus.AVAILABLE);

        User user = userRepo.findById(1L).
                orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        AuditLog log = new AuditLog().builder()
                .userId(user.getUserId())
                .entityType(EntityType.LOAN)
                .entityId(loan.getLoanId())
                .actionType(ActionType.CANCEL)
                .oldValue("Pending")
                .newValue("Cancelled out a loan with ID: " + loan.getLoanId())
                .message("Cancelled loan - " + loan.getAsset().getTitle())
                .build();
        auditLogService.createLog(log);

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public LoanResponseDTO approveLoan(Long loanId) {

        Loan loan = getEntity(loanId);
        loan.setStatus(LoanStatus.APPROVED);

        User user = userRepo.findById(1L).
                orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        AuditLog log = new AuditLog().builder()
                .userId(user.getUserId())
                .entityType(EntityType.LOAN)
                .entityId(loan.getLoanId())
                .actionType(ActionType.APPROVE)
                .oldValue("Pending")
                .newValue("Approved a loan with ID: " + loan.getLoanId())
                .message("Approved loan - " + loan.getAsset().getTitle())
                .build();
        auditLogService.createLog(log);

        User requester = userRepo.findById(loan.getUser().getUserId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                                "User not found."));

        emailService.sendApprovedLoanEmail(requester.getEmail(), requester.getFirstName(), loan.getAsset().getTitle());

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public LoanResponseDTO checkOutLoan(Long loanId){
        Loan loan = getEntity(loanId);

        if (loan.getAsset().getAssetStatus() == AssetStatus.LOANED) {
            throw new IllegalStateException("Asset already loaned out");
        }

        loan.getAsset().setAssetStatus(AssetStatus.LOANED);
        loan.setCheckoutDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(62));

        User user = userRepo.findById(1L).
                orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        AuditLog log = new AuditLog().builder()
                .userId(user.getUserId())
                .entityType(EntityType.LOAN)
                .entityId(loan.getLoanId())
                .actionType(ActionType.CHECK_OUT)
                .oldValue("APPROVED")
                .newValue("Checked out a loan with ID: " + loan.getLoanId())
                .message("Checked out - " + loan.getAsset().getTitle())
                .build();
        auditLogService.createLog(log);

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public LoanResponseDTO rejectLoan(Long loanId) {
        Loan loan = getEntity(loanId);

        User user = userRepo.findById(1L).
                orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        if (loan.getStatus() != LoanStatus.PENDING){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending loans can be rejected"
            );
        }

        loan.setStatus(LoanStatus.REJECTED);
        loan.getAsset().setAssetStatus(AssetStatus.AVAILABLE);

        AuditLog log = new AuditLog().builder()
                .userId(user.getUserId())
                .entityType(EntityType.LOAN)
                .entityId(loan.getLoanId())
                .actionType(ActionType.CANCEL)
                .oldValue("APPROVED")
                .newValue("Rejected loan with ID: " + loan.getLoanId())
                .message("Rejected - " + loan.getAsset().getTitle())
                .build();
        auditLogService.createLog(log);

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public LoanResponseDTO returnLoan(Long loanId) {

        Loan loan = getEntity(loanId);

        loan.setStatus(LoanStatus.RETURNED);
        loan.getAsset().setAssetStatus(AssetStatus.AVAILABLE);
        loan.setReturnDate(LocalDate.now());

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public void deleteLoan(Long loanId) {
        Loan loan = loanRepo.findById(loanId).orElseThrow(
                () -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "loan not found with id: " + loanId
                )
        );
        User user = userRepo.findById(1L).
                orElseThrow(
                        () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found")
                );

        AuditLog log = new AuditLog().builder()
                .userId(user.getUserId())
                .entityType(EntityType.LOAN)
                .entityId(loan.getLoanId())
                .actionType(ActionType.DELETE)
                .oldValue("N/A")
                .newValue("Deleted loan with ID: " + loan.getLoanId())
                .message("Deleted Loan - " + loan.getAsset())
                .build();
        auditLogService.createLog(log);

        loanRepo.delete(loan);
    }

    private Loan getEntity(Long id) {
        return loanRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Loan with ID " + id + " not found"
                )
        );
    }
}