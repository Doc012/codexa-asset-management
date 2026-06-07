package backend.asset.dto;

import backend.asset.enums.AssetCondition;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record AssetDto(
        String title,
        String category,
        String serialNumber,
        LocalDate acquisitionDate,
        Double cost,
        String location,
        AssetCondition condition,
        String photoPath
) {}

