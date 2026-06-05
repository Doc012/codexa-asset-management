package backend.Asset.model;

import jakarta.persistence.*;

import java.time.LocalDate;

@Entity // marks the class as a JPA Entity, tells Spring that this class should be mapped to a db
@Table(name = "assets")
public class Asset {

    @Id // identifies the PK of the entity
    @GeneratedValue(strategy = GenerationType.IDENTITY) // IDENTITY = auto-increment
    private Long assetId;

    private String title;
    private String category;

    @Column(unique = true) // ensures no two assets share the same serial number.
    private String serialNumber;

    @Temporal(TemporalType.DATE)
    // specifies how the data should be stored in the db (DATE = date only, no time)
    private LocalDate acquisitionDate;

    private Double cost;
    private String location;
    private String condition;
    private String photoPath;

    // Default constructor required by JPA:
    public Asset() {
    }

    public Asset(String title, String category, String serialNumber, LocalDate acquisitionDate,
                 Double cost, String location, String condition, String photoPath) {
        this.title = title;
        this.category = category;
        this.serialNumber = serialNumber;
        this.acquisitionDate = acquisitionDate;
        this.cost = cost;
        this.location = location;
        this.condition = condition;
        this.photoPath = photoPath;
    }

    public Long getAssetId() {
        return assetId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSerialNumber() {
        return serialNumber;
    }

    public void setSerialNumber(String serialNumber) {
        this.serialNumber = serialNumber;
    }

    public LocalDate getAcquisitionDate() {
        return acquisitionDate;
    }

    public void setAcquisitionDate(LocalDate acquisitionDate) {
        this.acquisitionDate = acquisitionDate;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getCondition() {
        return condition;
    }

    public void setCondition(String condition) {
        this.condition = condition;
    }

    public String getPhotoPath() {
        return photoPath;
    }

    public void setPhotoPath(String photoPath) {
        this.photoPath = photoPath;
    }
}
