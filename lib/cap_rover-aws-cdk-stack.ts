import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lightsail from "aws-cdk-lib/aws-lightsail";
import * as fs from "fs";
import * as path from "path";
import { UserData } from 'aws-cdk-lib/aws-ec2';

export class CapRoverAwsCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    //path script run instance
    let initScriptPath = "./script/docker-install.sh";

    const userData = fs.readFileSync(
      path.join(__dirname, initScriptPath),
      "utf-8"
    );

    const instance = new lightsail.CfnInstance(this, "instancia-1", {
      instanceName: "instancia-1",
      blueprintId: "amazon_linux_2",
      bundleId: "small_2_0",
      networking: {
        ports: [
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 22,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 80,
          },
          {
            protocol: "tcp",
            fromPort: 443,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 3000,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 996,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 7946,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 4789,
          },
          {
            protocol: "tcp",
            accessDirection: "outbound",
            fromPort: 2377,
          },
          {
            protocol: "udp",
            accessDirection: "outbound",
            fromPort: 7946,
          },
          {
            protocol: "udp",
            accessDirection: "outbound",
            fromPort: 4789,
          },
          {
            protocol: "udp",
            accessDirection: "outbound",
            fromPort: 2377,
          },
        ],
      },
      userData: `
      #!/bin/sh

      sudo yum update -y
      
      sudo amazon-linux-extras install docker -y
      
      sudo service docker start
      
      sudo systemctl enable docker
      
      sudo usermod -a -G docker ec2-user
      
      docker run -p 80:80 -p 443:443 -p 3000:3000 -v /var/run/docker.sock:/var/run/docker.sock -v /captain:/captain caprover/caprover`,
    });

    const ip=new lightsail.CfnStaticIp(this, "ip-1", {
      staticIpName: "static-ip-1",
      attachedTo: instance.instanceName,
    });

    ip.addDependency(instance);
  }
}
