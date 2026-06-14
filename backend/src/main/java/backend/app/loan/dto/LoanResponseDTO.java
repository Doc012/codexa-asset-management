package backend.app.loan.dto;

import backend.app.loan.enums.LoanStatus;

import java.time.LocalDate;

public record LoanResponseDTO(
        Long loanId,
        Long userId,
        Long assetId,
        LoanStatus status,
        LocalDate requestDate,
        LocalDate checkoutDate,
        LocalDate dueDate
) {}