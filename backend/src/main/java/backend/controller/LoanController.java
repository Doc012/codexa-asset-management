package backend.controller;

import backend.enums.LoanStatus;
import backend.model.Loan;
import backend.service.LoanService;
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
    public Loan getLoanById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @GetMapping
    public List<Loan> getAllLoans() {
        return loanService.getAllLoans();
    }

    @GetMapping("/status")
    public List<Loan> getLoanByStatus(@RequestParam LoanStatus status) {
        return loanService.findByStatus(status);
    }

    // APPROVE loan
    @PutMapping("/approve/{id}/")
    public Loan approveLoan(@PathVariable Long id) {
        return loanService.approveLoan(id);
    }

    // REJECT loan
    @PutMapping("reject/{id}/")
    public Loan rejectLoan(@PathVariable Long id) {
        return loanService.rejectLoan(id);
    }

    // RETURN loan
    @PutMapping("/return/{id}/")
    public Loan returnLoan(@PathVariable Long id) {
        return loanService.returnLoan(id);
    }

    // DELETE loan
    @DeleteMapping("/{id}")
    public void deleteLoan(@PathVariable Long id) {
        loanService.deleteLoan(id);
    }


    }