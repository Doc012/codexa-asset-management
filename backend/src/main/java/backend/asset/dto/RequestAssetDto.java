package backend.asset.dto;

import java.time.LocalDate;

public record RequestAssetDto(
        String title,
        String category,
        String serialNumber,
        LocalDate acquisitionDate,
        Double cost,
        String location,
        String condition,
        String photoPath
) { }
