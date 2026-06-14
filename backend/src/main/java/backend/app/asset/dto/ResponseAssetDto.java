package backend.app.asset.dto;

import lombok.Builder;

import java.time.LocalDate;

@Builder
public record ResponseAssetDto(
        Long assetId,
        String title,
        String category,
        String serialNumber,
        LocalDate acquisitionDate,
        Double cost,
        String location,
        String condition,
        String photoPath
) {}

