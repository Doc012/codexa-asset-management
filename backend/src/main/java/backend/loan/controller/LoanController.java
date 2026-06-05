package backend.loan.controller;

import backend.loan.service.LoanService;
import backend.loan.enums.LoanStatus;
import backend.loan.model.Loan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<Loan> createLoan(@RequestBody Loan loan) {
        Loan createdLoan = loanService.createLoan(loan);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(createdLoan);
    }

    @GetMapping("/{id}")
    public Loan getLoansById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @GetMapping("/user/{userId}")
    public List<Loan> getLoansByUserId(@PathVariable Long userId) {
        return loanService.getLoanByUser(userId);
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/status")
    public List<Loan> getLoansByStatus(@RequestParam LoanStatus status) {
        return loanService.getLoanByStatus(status);
    }

    // APPROVE loan
    @PutMapping("/{id}/approve")
    public Loan approveLoan(@PathVariable Long id) {
        return loanService.approveLoan(id);
    }

    // REJECT loan
    @PutMapping("/{id}/reject")
    public Loan rejectLoan(@PathVariable Long id) {
        return loanService.rejectLoan(id);
    }

    // RETURN loan
    @PutMapping("/{id}/return")
    public Loan returnLoan(@PathVariable Long id) {
        return loanService.returnLoan(id);
    }

    // DELETE loan
    @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
    }


}