package backend.asset.controller;

import backend.asset.dto.AssetDto;
import backend.asset.service.AssetService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/assets")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    public List<AssetDto> getAllAssets(){
        return assetService.getAllAssets();
    }

    @GetMapping("/{id}")
    public AssetDto getAssetById(@PathVariable Long id) {
        return assetService.getAssetById(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AssetDto createAsset(@RequestBody AssetDto newAsset){
        return assetService.createAsset(newAsset);
    }

    @PutMapping("/{id}")
    public AssetDto updateAsset(@PathVariable Long id, @RequestBody AssetDto asset){
        return assetService.updateAsset(id, asset);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteAsset(@PathVariable Long id) {
        assetService.deleteAsset(id);
    }

    @GetMapping("/serial/{serialNumber}")
    public AssetDto getAssetBySerialNumber(@PathVariable String serialNumber){
        return assetService.getAssetBySerialNumber(serialNumber);
    }

    @GetMapping("/category/{category}")
    public List<AssetDto> getAssetsByCategory(@PathVariable String category){
        return assetService.getAssetsByCategory(category);
    }
}
