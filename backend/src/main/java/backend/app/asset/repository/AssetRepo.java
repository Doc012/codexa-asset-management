package backend.app.asset.repository;

import backend.app.asset.enums.AssetCategory;
import backend.app.asset.enums.AssetCondition;
import backend.app.asset.enums.AssetStatus;
import backend.app.asset.model.Asset;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AssetRepo extends JpaRepository<Asset, Long> {

    Optional<Asset> findBySerialNumber(String serialNumber);
    List<Asset> findByCategory(AssetCategory category);
    List<Asset> findByLocation(String location);
    List<Asset> findByCondition(AssetCondition condition);
    List<Asset> findByAssetStatus(AssetStatus status);
}
