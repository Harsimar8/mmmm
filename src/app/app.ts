import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AssetBrowser } from './components/asset-browser/asset-browser';
import { Toolbar } from './components/toolbar/toolbar';
import {Map}from './components/map/map';

@Component({
  selector: 'app-root',
  imports: [ Toolbar, AssetBrowser ,Map],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('mission-editor');
}