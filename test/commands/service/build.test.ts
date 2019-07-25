import {expect, test} from '@oclif/test'

import {env, expectedStdOutForCmd, mainConfig} from '../../helper/test-helper'

describe('build', () => {
  test
    .env(env)
    .stdout()
    .command(['service:build', '--services', 'api', '--dry-run'])
    .it('invokes build with a known service', ctx => {
      expect(ctx.stdout).to.contain(expectedStdOutForCmd('build', mainConfig.compose.defaultEnvironment, []))
    })
})