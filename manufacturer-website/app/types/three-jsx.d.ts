import { Object3D, Material, BufferGeometry } from 'three'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any
      mesh: any
      sphereGeometry: any
      meshPhongMaterial: any
      meshBasicMaterial: any
      lineBasicMaterial: any
      ambientLight: any
      pointLight: any
      line: any
      primitive: any
      shaderMaterial: any
    }
  }
}

declare module '@react-three/fiber' {
  interface ThreeElements {
    group: any
    mesh: any
    sphereGeometry: any
    meshPhongMaterial: any
    meshBasicMaterial: any
    lineBasicMaterial: any
    ambientLight: any
    pointLight: any
    line: any
    primitive: any
    shaderMaterial: any
  }
} 