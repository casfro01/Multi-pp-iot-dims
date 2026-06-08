using DataAccess.Entities;
using Microsoft.EntityFrameworkCore;

namespace dataaccess;

public partial class MyDbContext : DbContext
{
    public MyDbContext(DbContextOptions<MyDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Answer> Answers { get; set; }

    public virtual DbSet<Question> Questions { get; set; }

    public virtual DbSet<Quiz> Quizzes { get; set; }

    public virtual DbSet<ScoreLog> ScoreLogs { get; set; }

    public virtual DbSet<User> Users { get; set; }

    public virtual DbSet<UserDeviceLink> UserDeviceLinks { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Answer>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("answers_pk");

            entity.ToTable("answers", "quiz");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.Correct).HasColumnName("correct");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");

            entity.HasOne(d => d.Question).WithMany(p => p.Answers)
                .HasForeignKey(d => d.QuestionId)
                .HasConstraintName("answers_answers_id_fk");
        });

        modelBuilder.Entity<Question>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("questions_pk");

            entity.ToTable("questions", "quiz");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Content).HasColumnName("content");
            entity.Property(e => e.QuizId).HasColumnName("quiz_id");

            entity.HasOne(d => d.Quiz).WithMany(p => p.Questions)
                .HasForeignKey(d => d.QuizId)
                .HasConstraintName("questions_questions_id_fk");
        });

        modelBuilder.Entity<Quiz>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("quiz_pk");

            entity.ToTable("quiz", "quiz");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Name).HasColumnName("name");
        });

        modelBuilder.Entity<ScoreLog>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("socre_log_pk");

            entity.ToTable("score_log", "quiz");

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.Correct).HasColumnName("correct");
            entity.Property(e => e.DateTime).HasColumnName("date_time");
            entity.Property(e => e.DeviceId).HasColumnName("device_id");
            entity.Property(e => e.QuestionId).HasColumnName("question_id");
            entity.Property(e => e.QuizId).HasColumnName("quiz_id");
            entity.Property(e => e.LobbyCode).HasColumnName("lobbycode");

            entity.HasOne(d => d.Question).WithMany(p => p.ScoreLogs)
                .HasForeignKey(d => d.QuestionId)
                .HasConstraintName("answers_answers_id_fk");

            entity.HasOne(d => d.Quiz).WithMany(p => p.ScoreLogs)
                .HasForeignKey(d => d.QuizId)
                .HasConstraintName("questions_questions_id_fk");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_pkey");

            entity.ToTable("user", "quiz");

            entity.Property(e => e.Id).HasColumnName("id");
            entity.Property(e => e.PasswordHash).HasColumnName("passwordhash");
            entity.Property(e => e.UserName).HasColumnName("username");
        });

        modelBuilder.Entity<UserDeviceLink>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("user_device_link_pk");

            entity.ToTable("user_device_link", "quiz");

            entity.HasIndex(e => e.DeviceId, "user_device_link_device_id_key").IsUnique();

            entity.Property(e => e.Id)
                .UseIdentityAlwaysColumn()
                .HasColumnName("id");
            entity.Property(e => e.DeviceId).HasColumnName("device_id");
            entity.Property(e => e.DisplayName).HasColumnName("display_name");
            entity.Property(e => e.UserId).HasColumnName("user_id");

            entity.HasOne(d => d.User).WithMany(p => p.UserDeviceLinks)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Cascade)
                .HasConstraintName("user_id_fk");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
