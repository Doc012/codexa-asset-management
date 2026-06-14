package backend.asset.model;

import backend.asset.enums.AssetCondition;
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
    private Long assetId;

    @NotBlank
    private String title;
    @NotBlank
    private String category;

    @Column(unique = true, nullable = false)
    private String serialNumber;

    @NotNull
    private LocalDate acquisitionDate;

    @NotNull
    private Double cost;
    @NotBlank
    private String location;

//    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private String condition;

    @NotBlank
    private String photoPath;

}
