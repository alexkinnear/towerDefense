const renderAnimatedTexture = (texture) => {
  context.save()

  let {center, size, rotation, assetName, animationIndex} = texture;
  context.translate(center.x, center.y);
  context.rotate(rotation);
  context.translate(-center.x, -center.y);

  context.drawImage(
    gameModel.assets[`${assetName}/${animationIndex}`],
    center.x - size.x / 2,
    center.y - size.y / 2,
    size.x, size.y
  );

  context.restore();
}

const renderTexture = (texture) => {
  context.save()

  let {center, size, rotation, assetName, animationIndex} = texture;
  context.translate(center.x, center.y);
  context.rotate(rotation);
  context.translate(-center.x, -center.y);

  context.drawImage(
    gameModel.assets[`${assetName}`],
    center.x - size.x / 2,
    center.y - size.y / 2,
    size.x, size.y
  );

  context.restore();
}
