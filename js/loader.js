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
                        if (fileExtension === 'mp3') {
                            asset.oncanplaythrough = function() {
                                asset.oncanplaythrough = null;  // Ugh, what a hack!
                                // window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
                        else {  // not terrific assumption that it has an 'onload' event, but that is what we are doing
                            asset.onload = function() {
                                window.URL.revokeObjectURL(asset.src);
                                if (onSuccess) { onSuccess(asset); }
                            };
                        }
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
            gameModel.assets[`fireParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load poison texture
    loadAsset(
        `assets/poison.png`,
        function(asset) {
            console.log(`poison.png loaded: ${asset.width}, ${asset.height}`);
            gameModel.assets[`poisonParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load slow texture
    loadAsset(
        `assets/slow.png`,
        function(asset) {
            console.log(`slow.png loaded: ${asset.width}, ${asset.height}`);
            gameModel.assets[`slowParticle`] = asset;
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
            gameModel.assets[`greenExplosionParticle`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load life texture
    loadAsset(
        `assets/heart.png`,
        function(asset) {
            console.log(`heart.png loaded: ${asset.width}, ${asset.height}`);
            gameModel.assets[`heart`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load boom sound
    loadAsset(
        `assets/Boom.mp3`,
        function(asset) {
            console.log(`Boom.mp3 loaded: ${asset}`);
            gameModel.assets[`boomSound`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load pew sound
    loadAsset(
        `assets/Pew.mp3`,
        function(asset) {
            console.log(`Pew.mp3 loaded: ${asset}}`);
            gameModel.assets[`pewSound`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load background music
    loadAsset(
        `assets/backgroundMusic.mp3`,
        function(asset) {
            console.log(`backgroundMusic.mp3 loaded: ${asset}}`);
            gameModel.assets[`backgroundMusic`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load creepDeath sound
    loadAsset(
        `assets/creepDeath.mp3`,
        function(asset) {
            console.log(`creepDeath.mp3 loaded: ${asset}}`);
            gameModel.assets[`creepDeath`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load towerUpgrade
    loadAsset(
        `assets/towerUpgrade.mp3`,
        function(asset) {
            console.log(`towerUpgrade.mp3 loaded: ${asset}}`);
            gameModel.assets[`towerUpgrade`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    // load sellTower
    loadAsset(
        `assets/sellTower.mp3`,
        function(asset) {
            console.log(`sellTower.mp3 loaded: ${asset}}`);
            gameModel.assets[`sellTower`] = asset;
        },
        function(error) {
            console.log('error: ', error);
        }
    );

    

}());