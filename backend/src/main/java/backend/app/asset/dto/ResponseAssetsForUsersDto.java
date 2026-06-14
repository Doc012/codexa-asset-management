package backend.app.asset.dto;

import java.time.LocalDate;

/**
 * This is for what the user sees (user dashboard)
 */
public record ResponseAssetsForUsersDto(
        Long assetId,
        String title,
        String category,
        String condition,
        String photoPath
) { }
