using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Origam.Service.Core;

namespace Origam.Chat;

public class WebApplicationExtender: IWebApplicationExtender
{
    public void Extend(IApplicationBuilder app, IConfiguration configuration)
    {
        string pathToChatApp = PathToChatApp(configuration);
        if (string.IsNullOrWhiteSpace(pathToChatApp))
        {
            return;
        }
        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(pathToChatApp),
            RequestPath = new PathString("/chatrooms"),
            OnPrepareResponse = ctx =>
            {
                if (ctx.File.Name == "index.html")
                {
                    ctx.Context.Response.Headers.Append(
                        "Cache-Control", $"no-store, max-age=0");
                }
            }
        });
        app.UseStaticFiles(new StaticFileOptions
        {
            RequestPath = new PathString("/chatAssets"),
            FileProvider = new PhysicalFileProvider(Path.Combine(pathToChatApp, "chatAssets"))
        });
    }

    private string PathToChatApp(IConfiguration configuration)
    {
        string pathToChatApp = configuration.GetSection("ChatConfig")["PathToChatApp"];
        if(!string.IsNullOrEmpty(pathToChatApp) && !Path.IsPathRooted(pathToChatApp))
        {
            throw new Exception($"The PathToChatApp \"{pathToChatApp}\" must be an absolute path");
        }
        return pathToChatApp;
    }
}