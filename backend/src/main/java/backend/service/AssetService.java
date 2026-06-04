package backend.service;

import backend.model.Asset;
import backend.repository.AssetRepo;
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
     * this method returns all the assets from the table
     * @return list of assets
     */
    public List<Asset> getAllAssets(){
        return assetRepo.findAll();
    }

    /**
     * this method returns an asset with the given Id
     * @param id - asset ID
     * @return a single asset, with the provided Id
     */
    public Asset getAssetById(Long id){
        return assetRepo.findById(id)
                .orElseThrow(
                        () -> new RuntimeException("Asset Not Found with ID: " + id)
                );
    }

    /**
     * This method creates a new asset
     * @param asset - the newly created asset -> user input
     * @return the details of the newly created asset
     */
    public Asset createAsset(Asset asset){
        return assetRepo.save(asset);
    }

    /**
     * this method deletes an asset with the id provided by the user
     * @param id - asset ID
     */
    public void deleteAsset(Long id){
        assetRepo.deleteById(id);
    }

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
    public Asset getAssetBySerialNumber(String serialNumber) {
        return assetRepo.findBySerialNumber(serialNumber)
                .orElseThrow(() -> new RuntimeException
                        ("Asset not found with Serial Number: " + serialNumber));
    }

    public List<Asset> getAssetsByCategory(String category) {
        return assetRepo.findByCategory(category);
    }
}
