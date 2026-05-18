using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace DataAccess.Entities;

public partial class User
{
    [Key]
    public string Id { get; set; } = null!;

    [Required] public string UserName { get; set; } = null!;

    [JsonIgnore]
    public string PasswordHash { get; set; } = null!;
}