package backend.asset.dto;

import backend.asset.enums.AssetCategory;
import backend.asset.enums.AssetCondition;
import backend.asset.enums.AssetStatus;

import java.time.LocalDate;

public record RequestAssetDto(
        String title,
        AssetCategory category,
        String serialNumber,
        LocalDate acquisitionDate,
        Double cost,
        String location,
        AssetCondition condition,
        String photoPath,
        AssetStatus assetStatus
) { }
