package backend.app.loan.dto;

import backend.app.asset.enums.AssetCategory;
import backend.app.asset.enums.AssetStatus;
import backend.app.loan.enums.LoanStatus;

import java.time.LocalDate;

public record LoanResponseDTO(
        Long loanId,
        Long userId,
        Long assetId,
        String title,
        AssetCategory category,
        AssetStatus assetStatus,
        String requesterEmail,
        String department,
        LoanStatus status,
        String rejectionReason,
        LocalDate requestDate,
        LocalDate checkoutDate,
        LocalDate returnDate,
        LocalDate dueDate
) {}