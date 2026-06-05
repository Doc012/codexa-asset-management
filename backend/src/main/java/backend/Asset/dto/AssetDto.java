package backend.Asset.dto;

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
        String condition,
        String photoPath
) {}

