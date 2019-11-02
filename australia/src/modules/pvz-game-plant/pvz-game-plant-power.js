import PvZGamePlantBase from "./pvz-game-plant-base";


class PvZGamePlantPower extends PvZGamePlantBase {
  constructor(...data) {
    super(2, ...data);
  }
  
}

PvZGamePlantPower.plantName = "power";
PvZGamePlantPower.price = 300;

export default PvZGamePlantPower;