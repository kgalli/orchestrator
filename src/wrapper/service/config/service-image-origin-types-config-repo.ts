import {ImageOriginType, ServiceImageOriginTypesConfig} from '../../../types/service-image-origin-types-config'
import YamlConfigFileRepo from '../../../utils/yaml-config-file-repo'

const CONFIG_FILE_NAME = 'image-origins.yaml'

interface ServiceImageOriginTypeMap {
  [service: string]: ImageOriginType;
}

export default class ServiceImageOriginTypesConfigRepo extends YamlConfigFileRepo<ServiceImageOriginTypesConfig> {
  constructor(configLocation: string, configFileName: string = CONFIG_FILE_NAME) {
    super(configLocation, configFileName)
  }

  init(environments: string[], services: string[]): void {
    const serviceImageOriginTypesConfig = {
      environments: environments
      .map(environment => ({
        name: environment,
        services: services
        .map(service => ({
          name: service, imageOriginType: ImageOriginType.REGISTRY,
        })),
      })),
    }

    this.write(serviceImageOriginTypesConfig)
  }

  // TODO implement validation logic and return errors if needed
  validate() {
    return true
  }

  load_by_environment(environment: string): ServiceImageOriginTypeMap {
    const serviceImageOriginTypes = super
    .load()
    .environments
    .filter(env => env.name === environment)
    .map(env => env.services)
    .pop() || []

    const serviceImageOriginTypeMap = {} as ServiceImageOriginTypeMap

    serviceImageOriginTypes.forEach(pair => {
      serviceImageOriginTypeMap[pair.name] = pair.imageOriginType
    })

    return serviceImageOriginTypeMap
  }

  updateImageOriginType(services: string[], environment: string, imageOriginType: ImageOriginType): void {
    const serviceImageOriginTypesConfig = this.load()
    const index = serviceImageOriginTypesConfig
    .environments
    .findIndex(env => env.name === environment) as number | undefined

    if (index === undefined) {
      serviceImageOriginTypesConfig.environments = []
      serviceImageOriginTypesConfig.environments.push({
        name: environment,
        services: services.map(service => ({name: service, imageOriginType})),
      })
    } else {
      const environmentServiceImageOriginTypesPairs = serviceImageOriginTypesConfig.environments[index]
      const serviceSet = new Set(services)

      environmentServiceImageOriginTypesPairs.services.forEach(pair => {
        if (serviceSet.has(pair.name)) {
          pair.imageOriginType = imageOriginType
        }
      })

      serviceImageOriginTypesConfig.environments[index] = environmentServiceImageOriginTypesPairs
    }

    this
    .write(serviceImageOriginTypesConfig)
  }
}
