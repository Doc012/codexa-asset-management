package backend.asset.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
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

    @NotBlank
    private LocalDate acquisitionDate;

    @NotBlank
    private Double cost;
    @NotBlank
    private String location;

    @NotBlank
    private String condition;
    @NotBlank
    private String photoPath;

}
