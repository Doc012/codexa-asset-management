package backend.loan.dto;

import backend.asset.enums.AssetCategory;
import backend.loan.enums.LoanStatus;

import java.time.LocalDate;

public record LoanResponseDTO(
        Long loanId,
        Long userId,
        Long assetId,
        String title,
        AssetCategory category,
        String requesterEmail,
        String department,
        LoanStatus status,
        LocalDate requestDate,
        LocalDate checkoutDate,
        LocalDate dueDate
) {}