package backend.loan.service;

import backend.Asset.model.Asset;
import backend.Asset.repository.AssetRepo;
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

    // CREATE Loan Request
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

        Loan loan = new Loan();
        loan.setUser(user);
        loan.setAsset(asset);
        loan.setRequestDate(LocalDate.now());
        loan.setStatus(LoanStatus.PENDING);

        return LoanMapper.toDTO(loanRepo.save(loan));
    }

    // GET Loan by ID
    public LoanResponseDTO getLoanById(Long id) {

        Loan loan = loanRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Loan with ID " + id + " not found"
                )
        );

        return LoanMapper.toDTO(loan);
    }

    // GET Loans by User
    public List<LoanResponseDTO> getLoanByUser(Long userId) {
        return loanRepo.findByUser_UserId(userId)
                .stream()
                .map(LoanMapper::toDTO)
                .toList();
    }

    // GET All Loans
    public List<LoanResponseDTO> getAllLoans() {
        return loanRepo.findAll()
                .stream()
                .map(LoanMapper::toDTO)
                .toList();
    }

    // GET Loans by Status
    public List<LoanResponseDTO> getLoanByStatus(LoanStatus status) {
        return loanRepo.findByStatus(status)
                .stream()
                .map(LoanMapper::toDTO)
                .toList();
    }

    // APPROVE Loan
    public LoanResponseDTO approveLoan(Long loanId) {

        Loan loan = getEntity(loanId);

        loan.setStatus(LoanStatus.APPROVED);
        loan.setCheckoutDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(7));

        return LoanMapper.toDTO(loanRepo.save(loan));
    }

    // REJECT Loan
    public LoanResponseDTO rejectLoan(Long loanId) {

        Loan loan = getEntity(loanId);

        loan.setStatus(LoanStatus.REJECTED);

        return LoanMapper.toDTO(loanRepo.save(loan));
    }

    // RETURN Loan
    public LoanResponseDTO returnLoan(Long loanId) {

        Loan loan = getEntity(loanId);

        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(LocalDate.now());

        return LoanMapper.toDTO(loanRepo.save(loan));
    }

    // DELETE Loan
    public void deleteLoan(Long loanId) {
        loanRepo.deleteById(loanId);
    }

    // Helper Method
    private Loan getEntity(Long id) {
        return loanRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Loan with ID " + id + " not found"
                )
        );
    }
<<<<<<< Updated upstream

    public List<Loan> getLoanByUser(Long userId) {
        return loanRepo.findByUser_UserId(userId);
    }

    public List<Loan> getAllLoans() {
        return loanRepo.findAll();
    }

    public List<Loan> getLoanByStatus(LoanStatus status) {
        return loanRepo.findByStatus(status);
    }

    // APPROVE loan
    public Loan approveLoan(Long loanId) {
        Loan loan = getLoanById(loanId);

        loan.setStatus(LoanStatus.APPROVED);
        loan.setCheckoutDate(LocalDate.now());
        loan.setDueDate(LocalDate.now().plusDays(7));

        return loanRepo.save(loan);
    }

    // REJECT loan
    public Loan rejectLoan(Long loanId) {
        Loan loan = getLoanById(loanId);
        loan.setStatus(LoanStatus.REJECTED);
        return loanRepo.save(loan);
    }

    // RETURN loan
    public Loan returnLoan(Long loanId) {
        Loan loan = getLoanById(loanId);

        loan.setStatus(LoanStatus.RETURNED);
        loan.setReturnDate(LocalDate.now());

        return loanRepo.save(loan);
    }

    // DELETE loan
    public void deleteLoan(Long loanId) {
        loanRepo.deleteById(loanId);
    }
}



=======
}
>>>>>>> Stashed changes
