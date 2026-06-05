package backend.Asset.service;

import backend.Asset.model.Asset;
import backend.Asset.repository.AssetRepo;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service // Marks the class as a Spring service
public class AssetService {

    private AssetRepo assetRepo;

    // Constructor injection
    public AssetService(AssetRepo assetRepo) {
        this.assetRepo = assetRepo;
    }

    /**
     * this method returns all the assets from the database
     * @return a list of assets
     */
    public List<Asset> getAllAssets(){
        return assetRepo.findAll();
    }

    /**
     * this method returns a single asset with the given Id
     * @param id - the ID of the asset
     * @return a single asset, matching the provided Id
     * @throws RuntimeException if the asset is not found
     */
    public Asset getAssetById(Long id){
        return assetRepo.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Asset Not Found with ID: " + id)
                );
    }

    /**
     * This method creates and saves a new asset
     * @param asset - the asset to be created -> user input
     * @return the details of the newly created asset
     */
    public Asset createAsset(Asset asset){
        return assetRepo.save(asset);
    }

    /**
     * this method deletes an asset with the id provided by the user
     * @param id - ID of the asset to be deleted
     */
    public void deleteAsset(Long id){
        assetRepo.deleteById(id);
    }

    /**
     * this method updates an existing asset with the new values
     * @param id the ID of the asset that is being updated
     * @param updatedAsset the new asset data
     * @return the updated asset
     * @throws RuntimeException if the asset is not found
     */
    public Asset updateAsset(Long id, Asset updatedAsset){
        Optional<Asset> existingAssetOptional = assetRepo.findById(id);

        if(existingAssetOptional.isPresent()){
            Asset existingAsset = existingAssetOptional.get();
            existingAsset.setTitle(updatedAsset.getTitle());
            existingAsset.setCategory(updatedAsset.getCategory());
            existingAsset.setSerialNumber(updatedAsset.getSerialNumber());
            existingAsset.setAcquisitionDate(updatedAsset.getAcquisitionDate());
            existingAsset.setCost(updatedAsset.getCost());
            existingAsset.setLocation(updatedAsset.getLocation());
            existingAsset.setCondition(updatedAsset.getCondition());
            existingAsset.setPhotoPath(updatedAsset.getPhotoPath());

            return assetRepo.save(existingAsset);

        } else {
            throw new RuntimeException("Asset Not Found");
        }
    }

    // Added new implementation methods:

    /**
     * this method gets an asset by its serial number (unique)
     * @param serialNumber the serial number of the asset
     * @return the asset with the matching serial number
     * @throws RuntimeException if the asset with the serial number is not found
     */
    public Asset getAssetBySerialNumber(String serialNumber) {
        return assetRepo.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException
                        ("Asset not found with Serial Number: " + serialNumber));
    }

    /**
     * this method gets a list of assets in a specific category
     * @param category is the category of the asset
     * @return a list of assets by the specified category
     */
    public List<Asset> getAssetsByCategory(String category) {
        return assetRepo.findByCategory(category);
    }
}
