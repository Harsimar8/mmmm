import { Injectable } from '@angular/core';
import { EntityRepository } from './EntityRepository';

@Injectable({
  providedIn: 'root'
})
export class ScenarioService {

  constructor(
    private entityRepository: EntityRepository
  ) {}

  saveScenario(): void {

  const scenario = {

    version: 1,

    entities: this.entityRepository.all()

  };

  const json = JSON.stringify(
    scenario,
    null,
    2
  );

  const blob = new Blob(
    [json],
    {
      type: 'application/json'
    }
  );

  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');

  link.href = url;

  link.download = 'scenario.json';

  link.click();

  URL.revokeObjectURL(url);

}


loadScenario(file: File): void {

    const reader = new FileReader();

    reader.onload = () => {

        const scenario = JSON.parse(
            reader.result as string
        );

        this.entityRepository.setAll(
            scenario.entities
        );

    };

    reader.readAsText(file);

}
}

