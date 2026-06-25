package backend.app.asset.dto;

import backend.app.asset.enums.AssetCategory;
import backend.app.asset.enums.AssetCondition;
import backend.app.asset.enums.AssetStatus;
import lombok.Builder;

import java.time.LocalDate;

@Builder
public recordResponseAssetDto(
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

