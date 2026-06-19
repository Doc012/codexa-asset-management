package backend.loan.service;

import backend.asset.enums.AssetStatus;
import backend.asset.model.Asset;
import backend.asset.repository.AssetRepo;
import backend.auditLog.enums.ActionType;
import backend.auditLog.enums.EntityType;
import backend.auditLog.model.AuditLog;
import backend.auditLog.service.AuditLogService;
import backend.loan.dto.LoanRequestDTO;
import backend.loan.dto.LoanResponseDTO;
import backend.loan.enums.LoanStatus;
import backend.loan.mapper.LoanMapper;
import backend.loan.model.Loan;
import backend.loan.repository.LoanRepo;
import backend.user.model.User;
import backend.user.repository.UserRepository;
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

        return loanMapper.toDTO(loanRepo.save(loan));
    }

    public LoanResponseDTO returnLoan(Long loanId) {

        Loan loan = getEntity(loanId);

        loan.setStatus(LoanStatus.RETURNED);
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