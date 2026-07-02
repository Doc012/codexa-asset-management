package backend.app.asset.dto;

import backend.app.asset.enums.AssetCategory;
import backend.app.asset.enums.AssetCondition;
import backend.app.asset.enums.AssetStatus;

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
        AssetStatus assetStatus,
        String comment
) { }
