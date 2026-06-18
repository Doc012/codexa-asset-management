package backend.asset.dto;

import backend.asset.enums.AssetCategory;
import backend.asset.enums.AssetCondition;
import backend.asset.enums.AssetStatus;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public record ResponseAssetDto(
        Long assetId,
        String title,
        AssetCategory category,
        String serialNumber,
        LocalDate acquisitionDate,
        Double cost,
        String location,
        AssetCondition condition,
        String photoPath,
        AssetStatus assetStatus
) {}

