import PlantBase from "./plant.base";


class PlantPower extends PlantBase {
  constructor(...data) {
    super(2, ...data);
  }
  
}

PlantPower.plantName = "power";
PlantPower.price = 300;

export default PlantPower;