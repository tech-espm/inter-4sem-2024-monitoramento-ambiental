#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>

DHT_Unified dht(2, DHT11);

void setup() {
  Serial.begin(115200);
  dht.begin();
}

void loop() {
  float temperatura, umidade, luminosidade, direcao;
  sensors_event_t event;

  dht.temperature().getEvent(&event);

  if (isnan(event.temperature)) {
    temperatura = 0;
  } else {
    temperatura = event.temperature;
  }

  dht.humidity().getEvent(&event);
  if (isnan(event.relative_humidity)) {
    umidade = 0;
  } else {
    umidade = event.relative_humidity;
  }

  luminosidade = 100.0f * analogRead(A0) / 1023.0f;
  direcao = 360.0f * analogRead(A1) / 1023.0f;

  Serial.print("{\"temperatura\": ");
  Serial.print(temperatura);
  Serial.print(", \"umidade_ar\": ");
  Serial.print(umidade);
  Serial.print(", \"luminosidade\": ");
  Serial.print(luminosidade);
  Serial.print(", \"direcao_vento\": ");
  Serial.print(direcao);
  Serial.println("}");

  delay(1000);
}
