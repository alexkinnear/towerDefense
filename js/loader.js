(function initialize() {
    //------------------------------------------------------------------
    //
    // This function is used to asynchronously load image and audio assets.
    // On success the asset is provided through the onSuccess callback.
    // Reference: http://www.html5rocks.com/en/tutorials/file/xhr2/
    //
    //------------------------------------------------------------------
    function loadAsset(source, onSuccess, onError) {
        let xhr = new XMLHttpRequest();
        let fileExtension = source.substr(source.lastIndexOf('.') + 1);    // Source: http://stackoverflow.com/questions/680929/how-to-extract-extension-from-filename-string-in-javascript

        if (fileExtension) {
            xhr.open('GET', source, true);
            xhr.responseType = (fileExtension === 'txt') ? 'text' : 'blob';

            xhr.onload = function() {
                let asset = null;
                if (xhr.status === 200) {
                    if (fileExtension === 'png' || fileExtension === 'jpg') {
                        asset = new Image();
                    } else if (fileExtension === 'mp3') {
                        asset = new Audio();
                    } else if (fileExtension === 'txt') {
                        if (onSuccess) { onSuccess(xhr.responseText); }
                    }
                    else {
                        if (onError) { onError('Unknown file extension: ' + fileExtension); }
                    }
                    if (xhr.responseType === 'blob') {
                        asset.onload = function() {
                            window.URL.revokeObjectURL(asset.src);
                            if (onSuccess) { onSuccess(asset); }
                        };
                        asset.src = window.URL.createObjectURL(xhr.response);
                    }
                } else {
                    if (onError) { onError('Failed to retrieve: ' + source); }
                }
            };
            xhr.send();
        } else {
            if (onError) { onError('Unknown file extension: ' + fileExtension); }
        }
    }

    // Load the groundCreep.png asset
    // loadAsset(
    //     'assets/groundCreep.png',
    //     function(asset) {
    //         console.log(`groundCreep.png loaded: ${asset.width}, ${asset.height}`);
    //         console.log('asset: ', asset);
    //         gameModel.assets['groundCreep'] = asset;
    //     },
    //     function(error) {
    //         console.log('error: ', error);
    //     }
    // );

    // Load all creep assets
    const creepTypes = 3;
    const creepColors = ['blue', 'green', 'red', 'yellow']
    for (let creepType = 1; creepType <= creepTypes; creepType++) {
        for (let color of creepColors) {
            let frames = 4;
            if (creepType === 1) frames = 6;

            for (let frame = 1; frame <= frames; frame++) {
                loadAsset(
                    `assets/creep/creep-${creepType}-${color}/${frame}.png`,
                    function(asset) {
                        console.log(`creep-${creepType}-${color}/${frame}.png loaded: ${asset.width}, ${asset.height}`);
                        // console.log('asset: ', asset);
                        gameModel.assets[`creep-${creepType}-${color}/${frame}`] = asset;
                    },
                    function(error) {
                        console.log('error: ', error);
                    }
                );
            }
        }
    }

    //load all tower types
    const towerTypes = 7;
    const towerLevels = 3;
    for (let towerType = 1; towerType <= towerTypes; towerType++) {
        let x = 400;
        for (let towerLevel = 1; towerLevel <= towerLevels; towerLevel++) {
            loadAsset(
                `assets/tower-defense-turrets/turret-${towerType}-${towerLevel}.png`,
                function(asset) {
                    console.log(`turret-${towerType}-${towerLevel}.png loaded: ${asset.width}, ${asset.height}`);
                    // console.log('asset: ', asset);
                    gameModel.assets[`turret-${towerType}-${towerLevel}`] = asset;
                },
                function(error) {
                    console.log('error: ', error);
                }
            );
        }
    }
    // load tower base
    loadAsset(
        `assets/tower-defense-turrets/turret-base.png`,
        function(asset) {
            console.log(`turret-base.png loaded: ${asset.width}, ${asset.height}`);
            // console.log('asset: ', asset);
            gameModel.assets[`turret-base`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load fire texture
    loadAsset(
        `assets/fire.png`,
        function(asset) {
            console.log(`fire.png loaded: ${asset.width}, ${asset.height}`);
            // console.log('asset: ', asset);
            gameModel.assets[`fireParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load confetti texture
    loadAsset(
        `assets/confetti.png`,
        function(asset) {
            console.log(`confetti.png loaded: ${asset.width}, ${asset.height}`);
            // console.log('asset: ', asset);
            gameModel.assets[`confettiParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load firework texture
    loadAsset(
        `assets/firework.png`,
        function(asset) {
            console.log(`firework.png loaded: ${asset.width}, ${asset.height}`);
            // console.log('asset: ', asset);
            gameModel.assets[`fireworkParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load green explosion texture
    loadAsset(
        `assets/greenExplosion.png`,
        function(asset) {
            console.log(`greenExplosion.png loaded: ${asset.width}, ${asset.height}`);
            // console.log('asset: ', asset);
            gameModel.assets[`greenExplosionParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );
    

}());