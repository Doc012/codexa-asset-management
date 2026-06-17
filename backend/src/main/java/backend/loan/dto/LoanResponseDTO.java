package backend.loan.dto;

import backend.loan.enums.LoanStatus;

import java.time.LocalDate;

public record LoanResponseDTO(
        Long loanId,
        Long userId,
        Long assetId,
        String title,
        String category,
        LoanStatus status,
        LocalDate requestDate,
        LocalDate checkoutDate,
        LocalDate dueDate
) {}