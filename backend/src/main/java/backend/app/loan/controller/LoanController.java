package backend.app.loan.controller;

import backend.app.loan.dto.LoanRequestDTO;
import backend.app.loan.dto.LoanResponseDTO;
import backend.app.loan.service.LoanService;
import backend.app.loan.enums.LoanStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<LoanResponseDTO> createLoan(@RequestBody LoanRequestDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(loanService.createLoan(dto));
    }

    @GetMapping("/{id}")
    public LoanResponseDTO getById(@PathVariable Long id) {
        return loanService.getLoanById(id);
    }

    @GetMapping("/user/{userId}")
    public List<LoanResponseDTO> getByUser(@PathVariable Long userId) {
        return loanService.getLoanByUser(userId);
    }

    @GetMapping
    public List<LoanResponseDTO> getAll() {
        return loanService.getAllLoans();
    }

    @GetMapping("/status")
    public List<LoanResponseDTO> getByStatus(@RequestParam String status) {
        try {
            LoanStatus statusReq = LoanStatus.valueOf(status.toUpperCase());
            return loanService.getLoanByStatus(statusReq);
        } catch (IllegalArgumentException e){
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Invalid status. " + e.getMessage()
            );
        }
    }

    @PutMapping("/approve/{id}")
    public LoanResponseDTO approve(@PathVariable Long id) {
        return loanService.approveLoan(id);
    }

    @PutMapping("/reject/{id}")
    public LoanResponseDTO reject(@PathVariable Long id) {
        return loanService.rejectLoan(id);
    }

    @PutMapping("/checkout/{id}")
    public LoanResponseDTO checkoutLoan(@PathVariable Long id){
        return loanService.checkOutLoan(id);
    }

    @PutMapping("/return/{id}")
    public LoanResponseDTO returnLoan(@PathVariable Long id) {
        return loanService.returnLoan(id);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        loanService.deleteLoan(id);
    }
}