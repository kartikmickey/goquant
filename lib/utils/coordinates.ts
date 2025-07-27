import * as THREE from "three";

export function latLngToVector3(
  lat: number,
  lng: number,
  radius: number = 1
): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);

  return new THREE.Vector3(x, y, z);
}

export function createCurve(
  start: THREE.Vector3,
  end: THREE.Vector3,
  height: number = 0.3
): THREE.Curve<THREE.Vector3> {
  const distance = start.distanceTo(end);
  const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
  const normal = new THREE.Vector3().subVectors(start, end).normalize();

  mid.setLength(1 + height * distance);

  return new THREE.CatmullRomCurve3([start, mid, end]);
}

export function getLatencyColor(latency: number): string {
  if (latency < 20) return "#10b981"; // green-500
  if (latency < 50) return "#84cc16"; // lime-500
  if (latency < 100) return "#eab308"; // yellow-500
  if (latency < 150) return "#f97316"; // orange-500
  return "#ef4444"; // red-500
}

export function getProviderColor(provider: "AWS" | "GCP" | "Azure"): string {
  switch (provider) {
    case "AWS":
      return "#ff9900";
    case "GCP":
      return "#4285f4";
    case "Azure":
      return "#0078d4";
  }
}
