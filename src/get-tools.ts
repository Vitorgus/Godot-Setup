import * as core from '@actions/core';
import * as tc from '@actions/tool-cache';
import * as io from '@actions/io';

export async function getGodot(version: string): Promise<string> {
  let godotPath = tc.find('godot', version, process.platform);

  if (godotPath) {
    core.info(`Godot ${version} found in cache! Path: ${godotPath}`);
    return godotPath;
  }

  let godot_exec = '';

  core.info(`Attempting to download Godot ${version} headless for linux...`);
  godot_exec = 'linux_headless.64';

  const godotFileName = `Godot_v${version}-stable_${godot_exec}`;

  const godotDownloadPath = await tc.downloadTool(`https://downloads.tuxfamily.org/godotengine/${version}/${godotFileName}.zip`);
  core.info(`Godot ${version} donwload sucessfull!`);

  core.info(`Attempting to extract Godot ${version}`);
  const godotExtractPath = await tc.extractZip(godotDownloadPath, undefined);
  core.info(`Godot ${version} extracted to ${godotExtractPath}`);

  core.info('Adding to cache...');
  godotPath = await tc.cacheFile(`${godotExtractPath}/${godotFileName}`, 'godot', 'godot', version, process.platform);
  core.info(`Godot ${version} cached!`);

  return godotPath;
}

export async function getTemplates(version: string): Promise<string> {
  let templatesPath = tc.find('templates', version, process.platform);

  if (templatesPath) {
    core.info(`Export templates ${version} found in cache! Path: ${templatesPath}`);
    return templatesPath;
  }

  const templatesFileName = `Godot_v${version}-stable_export_templates`;

  core.info(`Attempting to download Godot ${version} export templates...`);
  const templatesDownloadPath = await tc.downloadTool(`https://downloads.tuxfamily.org/godotengine/${version}/${templatesFileName}.tpz`);
  core.info(`Export templates for ${version} donwload sucessfull!`);

  core.info(`Attempting to extract templates for ${version}`);
  const templatesExtractPath = await tc.extractZip(templatesDownloadPath, undefined);
  core.info(`Export templates for ${version} extracted to ${templatesExtractPath}`);

  templatesPath = `/home/runner/.local/share/godot/templates/${version}.stable`;

  await io.mv(`${templatesExtractPath}/templates`, templatesPath);

  // core.info('Adding to cache...');
  // templatesPath = await tc.cacheFile(`${templatesExtractPath}/${templatesFileName}`, 'templates', 'templates', version, process.platform);
  // core.info(`Export templates for ${version} cached!`);

  return templatesPath;
}