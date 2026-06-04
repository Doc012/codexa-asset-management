package backend.controller;

import backend.model.Asset;
import backend.service.AssetService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AssetController {

    private AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping("/assets")
    public List<Asset> getAllAssets(){
        return assetService.getAllAssets();
    }

    @GetMapping("/assets/{id}")
    public Asset getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping("/assets")
    public Asset createAsset(@RequestBody Asset newAsset){
        return assetService.createAsset(newAsset);
    }

    @PutMapping("/assets/{id}")
    public Asset updateAsset(@PathVariable Long id, @RequestBody Asset asset){
        return assetService.updateAsset(id, asset);
    }

    @DeleteMapping("/assets/{id}")
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    // custom methods:
    @GetMapping("/assets/serial/{serialNumber}")
    public Asset getAssetBySerialNumber(@PathVariable String serialNumber){
        return assetService.getAssetBySerialNumber(serialNumber);
    }

    @GetMapping("/assets/category/{category}")
    public List<Asset> getAssetsByCategory(@PathVariable String category){
        return assetService.getAssetsByCategory(category);
    }
}
