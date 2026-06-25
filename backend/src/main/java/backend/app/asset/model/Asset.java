package backend.app.asset.model;

import backend.app.asset.enums.AssetCategory;
import backend.app.asset.enums.AssetCondition;
import backend.app.asset.enums.AssetStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "assets")
public class Asset {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "asset_id")
    private Long assetId;

    @NotBlank
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private AssetCategory category;

    @Column(name = "serial_number", unique = true, nullable = false)
    private String serialNumber;

    @NotNull
    @Column(name = "acquisition_date")
    private LocalDate acquisitionDate;

    @NotNull
    private Double cost;

    @NotBlank(message = "Location must not be blank")
    private String location;

    @Enumerated(EnumType.STRING)
    @Column(name = "condition", nullable = false)
    private AssetCondition condition;

    @Column(name = "photo_path")
    private String photoPath;

    @Enumerated(EnumType.STRING)
    @Column(name = "asset_status")
    private AssetStatus assetStatus = AssetStatus.AVAILABLE;

}
