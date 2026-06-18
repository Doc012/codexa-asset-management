package backend.asset.service;

import backend.asset.dto.RequestAssetDto;
import backend.asset.dto.ResponseAssetDto;
import backend.asset.enums.AssetStatus;
import backend.asset.model.Asset;
import backend.asset.repository.AssetRepo;
import backend.auditLog.enums.ActionType;
import backend.auditLog.enums.EntityType;
import backend.auditLog.model.AuditLog;
import backend.auditLog.service.AuditLogService;
import backend.user.enums.Role;
import backend.user.model.User;
import backend.user.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

@Service
public class AssetService {
    private final AssetRepo assetRepo;
    private final UserRepository userRepo;
    private final AuditLogService auditLogService;

    public AssetService(AssetRepo assetRepo, UserRepository userRepo, AuditLogService auditLogService) {
        this.assetRepo = assetRepo;
        this.userRepo = userRepo;
        this.auditLogService = auditLogService;
    }

    /**
     * this method returns all the assets from the database
     * @return a list of assets
     */
    public List<ResponseAssetDto> getAllAssets(){
//        return assetRepo.findAll();
        return assetRepo.findAll().stream()
                .map(asset -> new ResponseAssetDto(
                        asset.getAssetId(),
                        asset.getTitle(),
                        asset.getCategory(),
                        asset.getSerialNumber(),
                        asset.getAcquisitionDate(),
                        asset.getCost(),
                        asset.getLocation(),
                        asset.getCondition(),
                        asset.getPhotoPath(),
                        asset.getAssetStatus()
                ))
                .toList();
    }

    /**
     * this method returns a single asset with the given Id
     * @param id - the ID of the asset
     * @return a single asset, matching the provided Id
     * @throws RuntimeException if the asset is not found
     */
    public ResponseAssetDto getAssetById(Long id){
        Asset asset = assetRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Asset Not Found with ID: " + id)
                );

        return new ResponseAssetDto(
                asset.getAssetId(),
                asset.getTitle(),
                asset.getCategory(),
                asset.getSerialNumber(),
                asset.getAcquisitionDate(),
                asset.getCost(),
                asset.getLocation(),
                asset.getCondition(),
                asset.getPhotoPath(),
                asset.getAssetStatus()
        );
    }


    /**
     * This method creates and saves a new asset
     * @param assetDto - the asset to be created -> user input
     * @return the details of the newly created asset
     */
    public ResponseAssetDto createAsset(RequestAssetDto assetDto){
        Asset asset = Asset.builder()
                .title(assetDto.title())
                .category(assetDto.category())
                .serialNumber(assetDto.serialNumber())
                .acquisitionDate(assetDto.acquisitionDate())
                .cost(assetDto.cost())
                .location(assetDto.location())
                .condition(assetDto.condition())
                .photoPath(assetDto.photoPath())
                .assetStatus(AssetStatus.AVAILABLE)
                .build();

        Asset savedAsset = assetRepo.save(asset);

        return new ResponseAssetDto(
                savedAsset.getAssetId(),
                savedAsset.getTitle(),
                savedAsset.getCategory(),
                savedAsset.getSerialNumber(),
                savedAsset.getAcquisitionDate(),
                savedAsset.getCost(),
                savedAsset.getLocation(),
                savedAsset.getCondition(),
                savedAsset.getPhotoPath(),
                savedAsset.getAssetStatus()
        );
    }

    /**
     * this method deletes an asset with the id provided by the user
     * @param id - ID of the asset to be deleted
     */
    public void deleteAsset(Long id){
//        assetRepo.deleteById(id);
        if(!assetRepo.existsById(id)) {
            throw new RuntimeException("Asset Not Found");
        }
        assetRepo.deleteById(id);
    }

    /**
     * this method updates an existing asset with the new values
     * @param id the ID of the asset that is being updated
     * @param updatedAssetDto the new asset data
     * @return the updated asset
     * @throws RuntimeException if the asset is not found
     */
    @Transactional
    public ResponseAssetDto updateAsset(Long id, RequestAssetDto updatedAssetDto){
        Asset existingAsset = assetRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        User theUpdater = userRepo.findById(1L)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "User not found"
                ));

        String oldTitle = existingAsset.getTitle();
        String oldCategory = existingAsset.getCategory();
        String oldSerialNumber = existingAsset.getSerialNumber();
        LocalDate oldAcquisitionDate = existingAsset.getAcquisitionDate();
        Double oldCost = existingAsset.getCost();
        String oldLocation = existingAsset.getLocation();
        String oldCondition = existingAsset.getCondition();
        String oldPhotoPath = existingAsset.getPhotoPath();
        AssetStatus oldStatus = existingAsset.getAssetStatus();

        existingAsset.setTitle(updatedAssetDto.title());
        existingAsset.setCategory(updatedAssetDto.category());
        existingAsset.setSerialNumber(updatedAssetDto.serialNumber());
        existingAsset.setAcquisitionDate(updatedAssetDto.acquisitionDate());
        existingAsset.setCost(updatedAssetDto.cost());
        existingAsset.setLocation(updatedAssetDto.location());
        existingAsset.setCondition(updatedAssetDto.condition());
        existingAsset.setPhotoPath(updatedAssetDto.photoPath());
        existingAsset.setAssetStatus(updatedAssetDto.assetStatus());

        if (theUpdater.getRole() == Role.ADMIN){
            if (!java.util.Objects.equals(existingAsset.getTitle(), oldTitle)){
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldTitle)
                        .newValue(existingAsset.getTitle())
                        .message(theUpdater.getFirstName() + " updated asset title")
                        .build();
                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN){
            if (!java.util.Objects.equals(existingAsset.getCategory(), oldCategory)) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldCategory)
                        .newValue(existingAsset.getCategory())
                        .message(theUpdater.getFirstName() +
                                " updated category of asset: " + oldTitle)
                        .build();
                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN) {
            if (!java.util.Objects.equals(oldSerialNumber, existingAsset.getSerialNumber())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue("serial_number: " + oldSerialNumber)
                        .newValue("serial_number: " + existingAsset.getSerialNumber())
                        .message(theUpdater.getFirstName() +
                                " updated serial number of asset: " + oldTitle)
                        .build();

                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN) {
            if (!java.util.Objects.equals(oldAcquisitionDate, existingAsset.getAcquisitionDate())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue("acquisition_date: " + oldAcquisitionDate)
                        .newValue("acquisition_date: " + existingAsset.getAcquisitionDate())
                        .message(theUpdater.getFirstName() +
                                " updated acquisition date of asset: " + oldTitle)
                        .build();

                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN) {
            if (!java.util.Objects.equals(oldCost, existingAsset.getCost())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue("cost: " + oldCost)
                        .newValue("cost: " + existingAsset.getCost())
                        .message(theUpdater.getFirstName() +
                                " updated cost of asset: " + oldTitle)
                        .build();
                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN){
            if (!java.util.Objects.equals(oldLocation, existingAsset.getLocation())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldLocation)
                        .newValue(existingAsset.getLocation())
                        .message(theUpdater.getFirstName() +
                                " updated location of asset: " + oldTitle)
                        .build();

                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN) {
            if (!java.util.Objects.equals(oldCondition, existingAsset.getCondition())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldCondition)
                        .newValue(existingAsset.getCondition())
                        .message(theUpdater.getFirstName() +
                                " updated condition of asset: " + oldTitle)
                        .build();

                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN) {
            if (!java.util.Objects.equals(oldPhotoPath, existingAsset.getPhotoPath())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(oldPhotoPath)
                        .newValue(existingAsset.getPhotoPath())
                        .message(theUpdater.getFirstName() +
                                " updated photo of asset: " + oldTitle)
                        .build();
                auditLogService.createLog(log);
            }
        }

        if(theUpdater.getRole() == Role.ADMIN) {
            if (!java.util.Objects.equals(oldStatus, existingAsset.getAssetStatus())) {
                AuditLog log = AuditLog.builder()
                        .entityType(EntityType.ASSET)
                        .entityId(id)
                        .userId(theUpdater.getUserId())
                        .actionType(ActionType.UPDATE)
                        .oldValue(String.valueOf(oldStatus))
                        .newValue(existingAsset.getPhotoPath())
                        .message(theUpdater.getFirstName() +
                                " updated status of asset: " + oldTitle)
                        .build();

                auditLogService.createLog(log);
            }
        }

        Asset updated = assetRepo.save(existingAsset);

        return new ResponseAssetDto(
                updated.getAssetId(),
                updated.getTitle(),
                updated.getCategory(),
                updated.getSerialNumber(),
                updated.getAcquisitionDate(),
                updated.getCost(),
                updated.getLocation(),
                updated.getCondition(),
                updated.getPhotoPath(),
                updated.getAssetStatus()
        );
    }




    /**
     * new implementation methods
     */

    /**
     * this method gets an asset by its serial number (unique)
     * @param serialNumber the serial number of the asset
     * @return the asset with the matching serial number
     * @throws RuntimeException if the asset with the serial number is not found
     */
    public ResponseAssetDto getAssetBySerialNumber(String serialNumber) {
        Asset serialNumberAsset = assetRepo.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException
                        ("Asset not found with Serial Number: " + serialNumber));

        return new ResponseAssetDto(
                serialNumberAsset.getAssetId(),
                serialNumberAsset.getTitle(),
                serialNumberAsset.getCategory(),
                serialNumberAsset.getSerialNumber(),
                serialNumberAsset.getAcquisitionDate(),
                serialNumberAsset.getCost(),
                serialNumberAsset.getLocation(),
                serialNumberAsset.getCondition(),
                serialNumberAsset.getPhotoPath(),
                serialNumberAsset.getAssetStatus()
        );

    }

    /**
     * this method gets a list of assets in a specific category
     * @param category is the category of the asset
     * @return a list of assets by the specified category
     */
    public List<ResponseAssetDto> getAssetsByCategory(String category) {
        return assetRepo.findByCategory(category)
                .stream().map(asset -> new ResponseAssetDto(
                        asset.getAssetId(),
                        asset.getTitle(),
                        asset.getCategory(),
                        asset.getSerialNumber(),
                        asset.getAcquisitionDate(),
                        asset.getCost(),
                        asset.getLocation(),
                        asset.getCondition(),
                        asset.getPhotoPath(),
                        asset.getAssetStatus()
                ))
                .toList();
    }

    public List<ResponseAssetDto> getAssetsByStatus(String statusInput) {
        AssetStatus status = AssetStatus.valueOf(statusInput.toUpperCase());
        return assetRepo.findByAssetStatus(status)
                .stream().map(asset -> new ResponseAssetDto(
                        asset.getAssetId(),
                        asset.getTitle(),
                        asset.getCategory(),
                        asset.getSerialNumber(),
                        asset.getAcquisitionDate(),
                        asset.getCost(),
                        asset.getLocation(),
                        asset.getCondition(),
                        asset.getPhotoPath(),
                        asset.getAssetStatus()
                ))
                .toList();
    }


    public List<ResponseAssetDto> getAssetByCondition(String condition){
        return assetRepo.findByCondition(condition)
                .stream()
                .map(asset -> new ResponseAssetDto (
                        asset.getAssetId(),
                        asset.getTitle(),
                        asset.getCategory(),
                        asset.getSerialNumber(),
                        asset.getAcquisitionDate(),
                        asset.getCost(),
                        asset.getLocation(),
                        asset.getCondition(),
                        asset.getPhotoPath(),
                        asset.getAssetStatus()
                ))
                .toList();
    }



    /**
     * method to reduce boiler-plate code (converting from DTO - Entity
     * @param assetDto
     * @return
     */
//    private Asset mapToEntity(AssetDto assetDto){
//        return Asset.builder()
//                .title(assetDto.title())
//                .category(assetDto.category())
//                .serialNumber(assetDto.serialNumber())
//                .acquisitionDate(assetDto.acquisitionDate())
//                .cost(assetDto.cost())
//                .location(assetDto.location())
//                .condition(assetDto.condition())
//                .photoPath(assetDto.photoPath())
//                .build();
//    }

    /**
     * Reduce boiler-plate code (converting from Entity -> DTO)
     * @param asset
     * @return
     */
//    private AssetDto mapToDto(Asset asset){
//        return new AssetDto(
//                asset.getAssetId(),
//                asset.getTitle(),
//                asset.getCategory(),
//                asset.getSerialNumber(),
//                asset.getAcquisitionDate(),
//                asset.getCost(),
//                asset.getLocation(),
//                asset.getCondition(),
//                asset.getPhotoPath()
//        );
//    }
}
