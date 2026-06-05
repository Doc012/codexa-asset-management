package backend.asset.service;

import backend.asset.dto.AssetDto;
import backend.asset.model.Asset;
import backend.asset.repository.AssetRepo;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssetService {

    private final AssetRepo assetRepo;


    public AssetService(AssetRepo assetRepo) {
        this.assetRepo = assetRepo;
    }

    /**
     * this method returns all the assets from the database
     * @return a list of assets
     */
    public List<AssetDto> getAllAssets(){
//        return assetRepo.findAll();
        return assetRepo.findAll().stream()
                .map(asset -> new AssetDto(
                        asset.getTitle(),
                        asset.getCategory(),
                        asset.getSerialNumber(),
                        asset.getAcquisitionDate(),
                        asset.getCost(),
                        asset.getLocation(),
                        asset.getCondition(),
                        asset.getPhotoPath()
                ))
                .toList();
    }

    /**
     * this method returns a single asset with the given Id
     * @param id - the ID of the asset
     * @return a single asset, matching the provided Id
     * @throws RuntimeException if the asset is not found
     */
    public AssetDto getAssetById(Long id){
        Asset asset = assetRepo.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Asset Not Found with ID: " + id)
                );

        return new AssetDto(
                asset.getTitle(),
                asset.getCategory(),
                asset.getSerialNumber(),
                asset.getAcquisitionDate(),
                asset.getCost(),
                asset.getLocation(),
                asset.getCondition(),
                asset.getPhotoPath()
        );
    }

    /**
     * This method creates and saves a new asset
     * @param assetDto - the asset to be created -> user input
     * @return the details of the newly created asset
     */
    public AssetDto createAsset(AssetDto assetDto){
        Asset asset = Asset.builder()
                .title(assetDto.title())
                .category(assetDto.category())
                .serialNumber(assetDto.serialNumber())
                .acquisitionDate(assetDto.acquisitionDate())
                .cost(assetDto.cost())
                .location(assetDto.location())
                .condition(assetDto.condition())
                .photoPath(assetDto.photoPath())
                .build();

        Asset savedAsset = assetRepo.save(asset);

        return new AssetDto(
                savedAsset.getTitle(),
                savedAsset.getCategory(),
                savedAsset.getSerialNumber(),
                savedAsset.getAcquisitionDate(),
                savedAsset.getCost(),
                savedAsset.getLocation(),
                savedAsset.getCondition(),
                savedAsset.getPhotoPath()
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
    public AssetDto updateAsset(Long id, AssetDto updatedAssetDto){
        Asset existingAsset = assetRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Asset not found"));

        existingAsset.setTitle(updatedAssetDto.title());
        existingAsset.setCategory(updatedAssetDto.category());
        existingAsset.setSerialNumber(updatedAssetDto.serialNumber());
        existingAsset.setAcquisitionDate(updatedAssetDto.acquisitionDate());
        existingAsset.setCost(updatedAssetDto.cost());
        existingAsset.setLocation(updatedAssetDto.location());
        existingAsset.setCondition(updatedAssetDto.condition());
        existingAsset.setPhotoPath(updatedAssetDto.photoPath());

        Asset updated = assetRepo.save(existingAsset);

        return new AssetDto(
                updated.getTitle(),
                updated.getCategory(),
                updated.getSerialNumber(),
                updated.getAcquisitionDate(),
                updated.getCost(),
                updated.getLocation(),
                updated.getCondition(),
                updated.getPhotoPath()
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
    public AssetDto getAssetBySerialNumber(String serialNumber) {
        Asset serialNumberAsset = assetRepo.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException
                        ("Asset not found with Serial Number: " + serialNumber));

        return new AssetDto(
                serialNumberAsset.getTitle(),
                serialNumberAsset.getCategory(),
                serialNumberAsset.getSerialNumber(),
                serialNumberAsset.getAcquisitionDate(),
                serialNumberAsset.getCost(),
                serialNumberAsset.getLocation(),
                serialNumberAsset.getCondition(),
                serialNumberAsset.getPhotoPath()
        );

    }

    /**
     * this method gets a list of assets in a specific category
     * @param category is the category of the asset
     * @return a list of assets by the specified category
     */
    public List<AssetDto> getAssetsByCategory(String category) {
        return assetRepo.findByCategory(category)
                .stream().map(asset -> new AssetDto(
                        asset.getTitle(),
                        asset.getCategory(),
                        asset.getSerialNumber(),
                        asset.getAcquisitionDate(),
                        asset.getCost(),
                        asset.getLocation(),
                        asset.getCondition(),
                        asset.getPhotoPath()
                ))
                .toList();
    }


    /**
     * method to reduce boiler-plate code (converting from DTO - Entity
     * @param assetDto
     * @return
     */
    private Asset mapToEntity(AssetDto assetDto){
        return Asset.builder()
                .title(assetDto.title())
                .category(assetDto.category())
                .serialNumber(assetDto.serialNumber())
                .acquisitionDate(assetDto.acquisitionDate())
                .cost(assetDto.cost())
                .location(assetDto.location())
                .condition(assetDto.condition())
                .photoPath(assetDto.photoPath())
                .build();
    }

    /**
     * Reduce boiler-plate code (converting from Entity -> DTO)
     * @param asset
     * @return
     */
    private AssetDto maptToDto(Asset asset){
        return new AssetDto(
                asset.getTitle(),
                asset.getCategory(),
                asset.getSerialNumber(),
                asset.getAcquisitionDate(),
                asset.getCost(),
                asset.getLocation(),
                asset.getCondition(),
                asset.getPhotoPath()
        );
    }
}
