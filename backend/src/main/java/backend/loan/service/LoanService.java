package backend.loan.service;

import backend.loan.enums.LoanStatus;
import backend.loan.model.Loan;
import backend.loan.repository.LoanRepo;
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

    // CREATE Loan request
    public Loan createLoan(Loan loan) {
        loan.setStatus(LoanStatus.PENDING);
        return loanRepo.save(loan);
    }

    public Loan getLoanById(Long id) {
        return loanRepo.findById(id).orElseThrow(() ->
                new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Loan with ID " + id + " not found"
                )
        );
    }

    public List<Loan> getLoanByUser(Long userId) {
        return loanRepo.findByUserId(userId);
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



