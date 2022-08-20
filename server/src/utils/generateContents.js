export default async function generateContents(layers) {
  const layersArray = [];

  let appended = new Set();

  for (const element of layers) {
    const objToPush = {
      trait_type: element.trait_type,
      probability: element.probability,
      options: [],
    };

    if (appended.has(JSON.stringify(objToPush))) {
      continue;
    } else {
      layersArray.push(objToPush);
      appended.add(JSON.stringify(objToPush));
    }
  }

  for (const element of layers) {
    const optionToPush = {
      subtrait: element.subtrait,
      rarity: element.rarity,
    };
    for (let i = 0; i < layersArray.length; i++) {
      if (element.trait_type === layersArray[i].trait_type) {
        layersArray[i].options.push(optionToPush);
      }
    }
  }
  return layersArray;
}
