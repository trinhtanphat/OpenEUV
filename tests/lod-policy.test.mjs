import test from 'node:test'
import assert from 'node:assert/strict'
import { chooseLodMode, lodSettings } from '../src/lib/lodPolicy.mjs'

test('small mobile viewport chooses low LOD', () => {
  assert.equal(chooseLodMode({ width: 390, devicePixelRatio: 3, hardwareConcurrency: 8 }), 'low')
})

test('save-data and reduced-motion force low LOD', () => {
  assert.equal(chooseLodMode({ width: 1440, hardwareConcurrency: 16, saveData: true }), 'low')
  assert.equal(chooseLodMode({ width: 1440, hardwareConcurrency: 16, reducedMotion: true }), 'low')
})

test('mid-size or high-DPR devices choose balanced LOD', () => {
  assert.equal(chooseLodMode({ width: 900, devicePixelRatio: 1, hardwareConcurrency: 12 }), 'balanced')
  assert.equal(chooseLodMode({ width: 1440, devicePixelRatio: 2, hardwareConcurrency: 12 }), 'balanced')
})

test('capable desktop chooses high LOD', () => {
  assert.equal(chooseLodMode({ width: 1440, devicePixelRatio: 1.25, hardwareConcurrency: 16 }), 'high')
})

test('low LOD reduces renderer work without removing evidence labels', () => {
  const settings = lodSettings('low')
  assert.equal(settings.pixelRatioCap, 1)
  assert.equal(settings.animateSource, false)
  assert.equal(settings.shadowMaps, false)
  assert.equal(settings.labelDensity, 'selected')
})
