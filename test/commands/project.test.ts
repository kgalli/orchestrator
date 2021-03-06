import {expect, test} from '@oclif/test'

import {
  env, removeProjectsConfigDefault,
  TEST_CONFIG_DIR_PATH,
  TEST_WORK_DIR_PATH,
  writeProjectsConfigDefault,
} from '../helper/test-helper'

describe('project', () => {
  beforeEach(() => writeProjectsConfigDefault())
  afterEach(() => removeProjectsConfigDefault())

  context('project:list', () => {
    test
    .env(env)
    .stdout()
    .command(['project:list', '--csv'])
    .it('lists projects', ctx => {
      const csvOutput = ctx.stdout.split('\n')
      // header
      const header = csvOutput[0]
      expect(header).to.contain('Name,Workdir,Configdir,Default')
      // project column
      const firstProject = csvOutput[1].split(',')[0]
      expect(firstProject).to.eql('test')
      // working directory location column
      const firstWorkDirLocation = csvOutput[1].split(',')[1]
      expect(firstWorkDirLocation).to.eql(TEST_WORK_DIR_PATH)
      // main config location column
      const firstMainConfigLocation = csvOutput[1].split(',')[2]
      expect(firstMainConfigLocation).to.eql(TEST_CONFIG_DIR_PATH)
      // default project column
      const firstProjectDefault = csvOutput[1].split(',')[3]
      expect(firstProjectDefault).to.eql('true')
      // only one project in list
      expect(csvOutput.length).to.eql(3)
    })
  })

  context('project:add', () => {
    test
    .env(env)
    .stdout()
    .command(['project:add', 'project1', '-c', TEST_CONFIG_DIR_PATH, '-w', TEST_WORK_DIR_PATH])
    .command(['project:list', '--csv'])
    .it('adds the project', ctx => {
      const csvOutput = ctx.stdout.split('\n')
      // project column
      const firstProject = csvOutput[1].split(',')[0]
      const secondProject = csvOutput[2].split(',')[0]
      expect(firstProject).to.eql('project1')
      expect(secondProject).to.eql('test')
      // working directory location column
      const firstWorkDirLocation = csvOutput[1].split(',')[1]
      const secondWorkDirLocation = csvOutput[1].split(',')[1]
      expect(firstWorkDirLocation).to.eql(TEST_WORK_DIR_PATH)
      expect(secondWorkDirLocation).to.eql(TEST_WORK_DIR_PATH)
      // main config location column
      const firstMainConfigLocation = csvOutput[1].split(',')[2]
      const secondMainConfigLocation = csvOutput[2].split(',')[2]
      expect(firstMainConfigLocation).to.eql(TEST_CONFIG_DIR_PATH)
      expect(secondMainConfigLocation).to.eql(TEST_CONFIG_DIR_PATH)
      // default project column
      const firstProjectDefault = csvOutput[1].split(',')[3]
      const secondProjectDefault = csvOutput[2].split(',')[3]
      expect(firstProjectDefault).to.eql('')
      expect(secondProjectDefault).to.eql('true')
      // two projects in list
      expect(csvOutput.length).to.eql(4)
    })
  })

  context('project:remove', () => {
    test
    .env(env)
    .stdout()
    .command(['project:add', 'project1', '-c', TEST_CONFIG_DIR_PATH, '-w', TEST_WORK_DIR_PATH])
    .command(['project:remove', 'project1'])
    .command(['project:list', '--csv'])
    .it('removes the project', ctx => {
      const csvOutput = ctx.stdout.split('\n')
      // project column
      const firstProject = csvOutput[1].split(',')[0]
      expect(firstProject).to.eql('test')
      // main config location column
      const firstMainConfigLocation = csvOutput[1].split(',')[2]
      expect(firstMainConfigLocation).to.eql(TEST_CONFIG_DIR_PATH)
      // default project column
      const firstProjectDefault = csvOutput[1].split(',')[3]
      expect(firstProjectDefault).to.eql('true')
      // only one project in list
      expect(csvOutput.length).to.eql(3)
    })
  })

  context('project:set-default', () => {
    test
    .env(env)
    .stdout()
    .command(['project:add', 'project1', '-c', TEST_CONFIG_DIR_PATH, '-w', TEST_WORK_DIR_PATH])
    .command(['project:set-default', 'project1'])
    .command(['project:list', '--csv'])
    .it('sets the default project', ctx => {
      const csvOutput = ctx.stdout.split('\n')
      // project column
      const firstProject = csvOutput[1].split(',')[0]
      const secondProject = csvOutput[2].split(',')[0]
      expect(firstProject).to.eql('project1')
      expect(secondProject).to.eql('test')
      // main config location column
      const firstMainConfigLocation = csvOutput[1].split(',')[2]
      const secondMainConfigLocation = csvOutput[2].split(',')[2]
      expect(firstMainConfigLocation).to.eql(TEST_CONFIG_DIR_PATH)
      expect(secondMainConfigLocation).to.eql(TEST_CONFIG_DIR_PATH)
      // default project column
      const firstProjectDefault = csvOutput[1].split(',')[3]
      const secondProjectDefault = csvOutput[2].split(',')[3]
      expect(firstProjectDefault).to.eql('true')
      expect(secondProjectDefault).to.eql('')
      // two projects in list
      expect(csvOutput.length).to.eql(4)
    })
  })
})
