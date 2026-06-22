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
            
            loanRepo.save(loan);

            LoanResponseDTO createdLoan = loanMapper.toDTO(loanRepo.save(loan));

            AuditLog log = AuditLog.builder()
                    .entityType(EntityType.LOAN)
                    .entityId(createdLoan.loanId())
                    .userId(1L)
                    .actionType(ActionType.CREATE)
                    .oldValue("")
                    .newValue(createdLoan.toString())
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
        return loanRepo.findByUser_UserId(userId)
                .stream()
                .map(loanMapper::toDTO)
                .toList();
    }

    public List<LoanResponseDTO> getAllLoans() {
        return loanRepo.findAll()
                .stream()
                .map(loanMapper::toDTO)
                .toList();
    }

    public List<LoanResponseDTO> getLoanByStatus(LoanStatus status) {
        return loanRepo.findByStatus(status)
                .stream()
                .map(loanMapper::toDTO)
                .toList();
    }

    public LoanResponseDTO approveLoan(Long loanId) {

        Loan loan = getEntity(loanId);
        loan.setStatus(LoanStatus.APPROVED);
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

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public LoanResponseDTO rejectLoan(Long loanId) {
        Loan loan = getEntity(loanId);

        if (loan.getStatus() != LoanStatus.PENDING){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Only pending loans can be rejected"
            );
        }

        loan.setStatus(LoanStatus.REJECTED);
        loan.getAsset().setAssetStatus(AssetStatus.AVAILABLE);

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
        loanRepo.deleteById(loanId);
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