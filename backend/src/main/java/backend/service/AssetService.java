package backend.service;

import backend.model.Asset;
import backend.repository.AssetRepo;
import org.springframework.stereotype.Service;

import java.util.List;

@Service // Marks the class as a Spring service
public class AssetService {

    private AssetRepo assetRepo;

    // Constructor injection
    public AssetService(AssetRepo assetRepo) {
        this.assetRepo = assetRepo;
    }

    public List<Asset> getAllAssets(){
        return assetRepo.findAll();
    }

    public Asset getAssetById(Long id){
        return assetRepo.findById(id).orElseThrow(() -> new RuntimeException("Asset Not Found"));
    }

    public Asset createAsset(Asset asset){
        return assetRepo.save(asset);
    }

    public void deleteAsset(Long id){
        assetRepo.deleteById(id);
    }
}
