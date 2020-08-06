interface Scripts {
  name: string;
  src: string;
}

export const ScriptStore: Scripts[] = [
  { name: 'testFlutterWave', src: 'assets/js/test-flutter-wave-rave.js' },
  { name: 'liveFlutterWave', src: 'assets/js/flutter-wave-rave.js' },
  { name: 'payPalTest', src: 'https://www.paypalobjects.com/api/checkout.js'}
];
