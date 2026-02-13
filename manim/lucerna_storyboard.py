from manim import *

PROJECT_TITLE = "Neuro Magnetometry"

PALETTE = {
    "bg": "#0b0e14",
    "text": "#f4f1de",
    "accent": "#e07a5f",
    "green": "#81b29a",
    "blue": "#3d5a80",
    "red": "#e63946",
    "gold": "#f2cc8f",
}


def build_neuron(color, soma_radius=0.4, axon_length=3.8, myelin_count=4, show_nucleus=True):
    soma = Circle(radius=soma_radius, color=color)
    soma.set_fill(color, opacity=0.3)
    nucleus = None
    if show_nucleus:
        nucleus = Circle(radius=soma_radius * 0.35, color=PALETTE["red"])
        nucleus.set_fill(PALETTE["red"], opacity=0.35)
        nucleus.move_to(soma.get_center())

    dendrites = VGroup()
    for angle in [20, 70, 120, 200, 250, 320]:
        direction = rotate_vector(RIGHT, angle * DEGREES)
        start = soma.get_center() + direction * (soma_radius * 0.7)
        mid = start + direction * 0.7 + rotate_vector(direction, 30 * DEGREES) * 0.15
        end = start + direction * 1.3 + rotate_vector(direction, -25 * DEGREES) * 0.2
        branch = VMobject(color=color)
        branch.set_points_smoothly([start, mid, end])
        dendrites.add(branch)

    axon_start = soma.get_right()
    axon_end = axon_start + RIGHT * axon_length
    axon = Line(axon_start, axon_end, color=color, stroke_width=3)

    myelin = VGroup()
    if myelin_count > 0:
        segment_len = axon_length / (myelin_count * 1.6)
        for i in range(myelin_count):
            seg = RoundedRectangle(width=segment_len, height=0.3, corner_radius=0.08, color=PALETTE["text"])
            seg.set_fill(PALETTE["text"], opacity=0.08)
            seg.move_to(axon_start + RIGHT * (segment_len * (1.2 + i * 1.6)))
            myelin.add(seg)

    terminals = VGroup()
    for offset in [UP * 0.4, DOWN * 0.4]:
        branch = Line(axon_end, axon_end + offset + RIGHT * 0.4, color=color, stroke_width=2)
        terminals.add(branch)

    parts = [soma, dendrites, axon, myelin, terminals]
    if nucleus is not None:
        parts.insert(1, nucleus)
    return VGroup(*parts)


def build_microscope(color):
    base = RoundedRectangle(width=3.4, height=0.45, corner_radius=0.12, color=color)
    base.set_fill(color, opacity=0.08)
    base.move_to(DOWN * 2.0)

    pillar = Rectangle(width=0.32, height=2.6, color=color)
    pillar.set_fill(color, opacity=0.05)
    pillar.move_to(base.get_left() + RIGHT * 0.8 + UP * 1.35)

    head = RoundedRectangle(width=1.0, height=0.45, corner_radius=0.08, color=color)
    head.set_fill(color, opacity=0.08)
    head.move_to(pillar.get_top() + UP * 0.2)

    tube = Rectangle(width=0.36, height=1.6, color=color)
    tube.set_fill(color, opacity=0.06)
    tube.move_to(head.get_bottom() + DOWN * 0.9 + RIGHT * 0.25)

    eyepiece = Rectangle(width=0.6, height=0.2, color=color)
    eyepiece.set_fill(color, opacity=0.12)
    eyepiece.move_to(head.get_top() + UP * 0.15)

    nosepiece = Ellipse(width=1.0, height=0.32, color=color)
    nosepiece.set_fill(color, opacity=0.08)
    nosepiece.move_to(tube.get_bottom() + DOWN * 0.25)

    objectives = VGroup()
    for offset in [LEFT * 0.35, ORIGIN, RIGHT * 0.35]:
        obj = Rectangle(width=0.25, height=0.45, color=color)
        obj.set_fill(color, opacity=0.1)
        obj.move_to(nosepiece.get_center() + offset + DOWN * 0.35)
        objectives.add(obj)

    focus_knob = Circle(radius=0.2, color=color)
    focus_knob.set_fill(color, opacity=0.1)
    focus_knob.move_to(pillar.get_center() + RIGHT * 0.2)

    return VGroup(base, pillar, head, tube, eyepiece, nosepiece, objectives, focus_knob)


class TitleScene(Scene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]

        dish = Circle(radius=2.6, color=PALETTE["blue"])
        dish.set_fill(PALETTE["blue"], opacity=0.08)

        team = Text("LUCERNA", font="Times New Roman", weight=BOLD, color=PALETTE["gold"])
        team.scale(1.6)
        title = Text(PROJECT_TITLE, font="Times New Roman", color=PALETTE["text"])
        title.next_to(team, DOWN)

        glow = Circle(radius=2.6, color=PALETTE["accent"], stroke_opacity=0.35)
        glow.set_fill(PALETTE["accent"], opacity=0.08)

        self.play(FadeIn(glow, scale=1.2), Write(team))
        self.wait(0.6)
        self.play(Write(title))
        self.wait(1.6)
        self.play(FadeOut(glow), FadeOut(team), FadeOut(title))


class CultureScene(Scene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]

        dish = Circle(radius=2.6, color=PALETTE["blue"])
        dish.set_fill(PALETTE["blue"], opacity=0.08)

        neurons = VGroup()
        neuron_positions = [
            LEFT * 1.2 + UP * 0.9,
            UP * 1.1,
            RIGHT * 1.1 + UP * 0.6,
            LEFT * 0.6,
            RIGHT * 0.9 + DOWN * 0.2,
            LEFT * 0.9 + DOWN * 0.9,
            RIGHT * 0.2 + DOWN * 1.0,
        ]
        for pos in neuron_positions:
            neuron = build_neuron(PALETTE["accent"], soma_radius=0.3, axon_length=1.2, myelin_count=0, show_nucleus=False)
            neuron.scale(0.6)
            neuron.move_to(pos)
            neurons.add(neuron)

        neurons.move_to(dish.get_center())

        microscope = build_microscope(PALETTE["text"])
        microscope.scale(1.05)
        microscope.to_edge(LEFT, buff=1.2)
        microscope.shift(DOWN * 0.2 + LEFT * 0.2)
        microscope_label = Text("Microscope", font="Georgia", color=PALETTE["text"])
        microscope_label.scale(0.45)
        microscope_label.next_to(microscope, DOWN)

        culture_label = Text("Neuron culture", font="Georgia", color=PALETTE["text"]).scale(0.4)
        culture_label.next_to(dish, DOWN, buff=0.2)

        self.play(FadeIn(dish), FadeIn(neurons), FadeIn(microscope), Write(microscope_label), Write(culture_label))
        self.wait(0.7)

        microwave = self._make_wave().next_to(dish, RIGHT, buff=0.6)
        mw_label = Text("Microwave", font="Georgia", color=PALETTE["accent"])
        mw_label.scale(0.45)
        mw_label.next_to(microwave, DOWN, buff=0.1)

        self.play(Create(microwave), Write(mw_label))
        self.wait(0.6)

        energy_axes = Axes(
            x_range=[0, 1],
            y_range=[0, 1.4],
            x_length=3.2,
            y_length=2.2,
            axis_config={"color": PALETTE["text"], "stroke_width": 2},
        ).to_edge(RIGHT)
        s0 = Dot(energy_axes.c2p(0.5, 0.2), color=PALETTE["green"])
        s1 = Dot(energy_axes.c2p(0.5, 1.0), color=PALETTE["red"])
        s0_label = Text("Spin 0", font="Georgia", color=PALETTE["green"]).scale(0.4)
        s1_label = Text("Spin +-1", font="Georgia", color=PALETTE["red"]).scale(0.4)
        s0_label.next_to(s0, LEFT, buff=0.2)
        s1_label.next_to(s1, LEFT, buff=0.2)
        arrow = Arrow(s0.get_top(), s1.get_bottom(), color=PALETTE["accent"], buff=0.1)

        self.play(FadeIn(energy_axes), FadeIn(s0), FadeIn(s1), FadeIn(s0_label), FadeIn(s1_label))
        self.play(GrowArrow(arrow))
        self.wait(1.0)

        self.play(FadeOut(microwave), FadeOut(mw_label), FadeOut(arrow))
        self.wait(0.6)

    def _make_wave(self):
        wave = ParametricFunction(
            lambda t: np.array([t, 0.2 * np.sin(6 * t), 0]),
            t_range=[0, 3],
            color=PALETTE["accent"],
        )
        return wave


class NVCenterCaptureScene(Scene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]

        # --- 3D-inspired view (left) ---
        diamond_top = Polygon(
            LEFT * 2.2 + UP * 0.6,
            RIGHT * 2.2 + UP * 0.6,
            RIGHT * 1.6 + UP * 0.1,
            LEFT * 2.8 + UP * 0.1,
            color=PALETTE["blue"],
        )
        diamond_top.set_fill(PALETTE["blue"], opacity=0.18)
        diamond_face = Polygon(
            LEFT * 2.8 + UP * 0.1,
            RIGHT * 1.6 + UP * 0.1,
            RIGHT * 1.6 + DOWN * 0.6,
            LEFT * 2.8 + DOWN * 0.6,
            color=PALETTE["blue"],
        )
        diamond_face.set_fill(PALETTE["blue"], opacity=0.12)
        diamond_right = Polygon(
            RIGHT * 2.2 + UP * 0.6,
            RIGHT * 2.2 + DOWN * 0.1,
            RIGHT * 1.6 + DOWN * 0.6,
            RIGHT * 1.6 + UP * 0.1,
            color=PALETTE["blue"],
        )
        diamond_right.set_fill(PALETTE["blue"], opacity=0.08)

        nv_centers = VGroup()
        for i in range(7):
            nv = Dot(color=PALETTE["gold"]).scale(0.7)
            nv.move_to(diamond_face.get_left() + RIGHT * (0.5 + i * 0.55) + DOWN * 0.2)
            nv_centers.add(nv)
        nv_label = Text("NV centers", font="Georgia", color=PALETTE["text"]).scale(0.3)
        nv_label.next_to(diamond_right, RIGHT, buff=0.2)

        sample = RoundedRectangle(width=2.6, height=0.35, corner_radius=0.15, color=PALETTE["accent"])
        sample.set_fill(PALETTE["accent"], opacity=0.22)
        sample.move_to(diamond_top.get_top() + DOWN * 0.05)
        sample_label = Text("Neuron culture", font="Georgia", color=PALETTE["text"]).scale(0.32)
        sample_label.next_to(sample, UP, buff=0.08)

        # Green laser hits side of diamond, scattering only to the right
        green_in = Arrow(
            LEFT * 5.0 + UP * 0.15,
            diamond_face.get_left() + UP * 0.1,
            color=PALETTE["green"],
            buff=0,
            stroke_width=6,
        )
        green_label = Text("532 nm", font="Georgia", color=PALETTE["green"]).scale(0.4)
        green_label.next_to(green_in.get_start(), UP, buff=0.1)

        scatter_out = Arrow(
            diamond_right.get_center() + UP * 0.1,
            diamond_right.get_center() + RIGHT * 2.0 + UP * 0.1,
            color=PALETTE["green"],
            buff=0,
            stroke_width=3,
        )
        scatter_out.set_opacity(0.6)

        currents = VGroup()
        for offset in [LEFT * 0.7, LEFT * 0.1, RIGHT * 0.5]:
            current = CurvedArrow(
                sample.get_center() + offset + LEFT * 0.2,
                sample.get_center() + offset + RIGHT * 0.2,
                color=PALETTE["accent"],
                angle=-PI / 2,
            )
            current.scale(0.45)
            currents.add(current)

        red_emissions = VGroup()
        for nv in nv_centers[1::2]:
            emission = Arrow(
                nv.get_bottom(),
                nv.get_bottom() + DOWN * 1.4,
                color=PALETTE["red"],
                buff=0,
                stroke_width=4,
            )
            red_emissions.add(emission)
        red_label = Text("680 nm", font="Georgia", color=PALETTE["red"]).scale(0.4)
        red_label.next_to(red_emissions.get_bottom(), DOWN, buff=0.1)

        title_3d = Text("3D view", font="Georgia", color=PALETTE["text"]).scale(0.34)
        title_3d.to_edge(UP, buff=0.25)

        three_d_group = VGroup(
            diamond_top,
            diamond_face,
            diamond_right,
            nv_centers,
            nv_label,
            sample,
            sample_label,
            green_in,
            green_label,
            scatter_out,
            currents,
            red_emissions,
            red_label,
        )
        three_d_group.scale(0.85)
        three_d_group.to_edge(UP, buff=0.6)

        # --- 2D schematic view (right) ---
        layer = Rectangle(width=3.1, height=0.3, color=PALETTE["blue"])
        layer.set_fill(PALETTE["blue"], opacity=0.2)
        layer.move_to(RIGHT * 2.8 + UP * 0.5)

        insulating = Rectangle(width=3.1, height=0.18, color=PALETTE["text"])
        insulating.set_fill(PALETTE["text"], opacity=0.06)
        insulating.next_to(layer, DOWN, buff=0.05)

        neuron_slice = Rectangle(width=1.6, height=0.25, color=PALETTE["accent"])
        neuron_slice.set_fill(PALETTE["accent"], opacity=0.25)
        neuron_slice.next_to(layer, UP, buff=0.05)

        nv_row = VGroup()
        for i in range(9):
            nv = Dot(color=PALETTE["gold"]).scale(0.55)
            nv.move_to(insulating.get_left() + RIGHT * (0.35 + i * 0.35) + DOWN * 0.18)
            nv_row.add(nv)

        label_brain = Text("Neuron culture", font="Georgia", color=PALETTE["text"]).scale(0.3)
        label_brain.next_to(neuron_slice, UP, buff=0.05)
        label_layer = Text("Layer", font="Georgia", color=PALETTE["text"]).scale(0.28)
        label_layer.next_to(layer, LEFT, buff=0.2)
        label_insulating = Text("Insulating", font="Georgia", color=PALETTE["text"]).scale(0.26)
        label_insulating.next_to(insulating, LEFT, buff=0.2)
        label_nv = Text("NV", font="Georgia", color=PALETTE["text"]).scale(0.26)
        label_nv.next_to(nv_row, LEFT, buff=0.2)

        green_in_2d = Arrow(
            layer.get_left() + LEFT * 1.2 + DOWN * 0.3,
            layer.get_left() + DOWN * 0.3,
            color=PALETTE["green"],
            buff=0,
            stroke_width=6,
        )
        green_scatter_2d = Arrow(
            layer.get_right() + DOWN * 0.3,
            layer.get_right() + RIGHT * 1.1 + DOWN * 0.3,
            color=PALETTE["green"],
            buff=0,
            stroke_width=3,
        )
        green_scatter_2d.set_opacity(0.6)
        red_down_2d = Arrow(
            layer.get_center() + DOWN * 0.1,
            layer.get_center() + DOWN * 1.0,
            color=PALETTE["red"],
            buff=0,
            stroke_width=4,
        )
        red_label_2d = Text("680 nm", font="Georgia", color=PALETTE["red"]).scale(0.3)
        red_label_2d.next_to(red_down_2d.get_end(), DOWN, buff=0.05)

        currents_2d = VGroup()
        for offset in [LEFT * 0.5, ORIGIN, RIGHT * 0.5]:
            loop = CurvedArrow(
                neuron_slice.get_center() + offset + LEFT * 0.18,
                neuron_slice.get_center() + offset + RIGHT * 0.18,
                color=PALETTE["accent"],
                angle=-PI / 2,
            )
            loop.scale(0.35)
            currents_2d.add(loop)

        divider = Line(LEFT * config.frame_x_radius, RIGHT * config.frame_x_radius, color=PALETTE["text"])
        divider.set_stroke(width=2, opacity=0.5)

        title_2d = Text("2D view", font="Georgia", color=PALETTE["text"]).scale(0.34)
        title_2d.next_to(divider, DOWN, buff=0.2)

        two_d_group = VGroup(
            layer,
            insulating,
            neuron_slice,
            nv_row,
            label_brain,
            label_layer,
            label_insulating,
            label_nv,
            green_in_2d,
            green_scatter_2d,
            red_down_2d,
            red_label_2d,
            currents_2d,
        )
        two_d_group.scale(0.95)
        two_d_group.to_edge(DOWN, buff=0.6)
        two_d_group.move_to(RIGHT * 0 + DOWN * (config.frame_y_radius - 1.6))

        self.play(FadeIn(three_d_group), FadeIn(two_d_group), Create(divider), FadeIn(title_3d), FadeIn(title_2d))
        self.play(GrowArrow(green_in), Write(green_label), GrowArrow(scatter_out))
        self.play(LaggedStart(*[Create(c) for c in currents], lag_ratio=0.2))
        self.play(LaggedStart(*[GrowArrow(e) for e in red_emissions], lag_ratio=0.15), Write(red_label))
        self.play(GrowArrow(green_in_2d), GrowArrow(green_scatter_2d))
        self.play(LaggedStart(*[Create(c) for c in currents_2d], lag_ratio=0.2))
        self.play(GrowArrow(red_down_2d), Write(red_label_2d))
        self.wait(0.8)
        self.play(FadeOut(VGroup(three_d_group, two_d_group, divider, title_3d, title_2d)))


class MicroscopeZoomScene(MovingCameraScene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]

        neuron = build_neuron(PALETTE["green"], soma_radius=0.55, axon_length=5.2, myelin_count=5, show_nucleus=True)
        neuron.shift(LEFT * 2.2)
        membrane = Rectangle(width=6, height=1.2, color=PALETTE["green"])
        membrane.set_fill(PALETTE["green"], opacity=0.08)
        membrane.to_edge(RIGHT, buff=1.0)
        membrane_label = Text("Membrane", font="Georgia", color=PALETTE["text"]).scale(0.38)
        membrane_label.next_to(membrane, UP, buff=0.15)

        self.play(FadeIn(neuron), FadeIn(membrane), Write(membrane_label))
        self.wait(0.5)

        self.play(self.camera.frame.animate.scale(0.6).move_to(membrane))
        ions = VGroup()
        ion_targets = VGroup()
        for i in range(6):
            ion = Dot(color=PALETTE["accent"]).scale(0.6)
            ion.move_to(membrane.get_left() + RIGHT * (0.7 + i * 0.65) + UP * 0.7)
            target = Dot(color=PALETTE["accent"]).scale(0.6)
            target.move_to(membrane.get_left() + RIGHT * (0.7 + i * 0.65) + DOWN * 0.1)
            ions.add(ion)
            ion_targets.add(target)
        channel_label = Text("Ion channels open", font="Georgia", color=PALETTE["text"]).scale(0.4)
        channel_label.next_to(membrane, DOWN, buff=0.25)
        self.play(Write(channel_label))
        self.play(LaggedStart(*[Transform(ion, target) for ion, target in zip(ions, ion_targets)], lag_ratio=0.12))
        self.wait(0.6)

        self.play(self.camera.frame.animate.scale(1.6).move_to(neuron), FadeOut(channel_label))
        self.play(FadeOut(ions), run_time=0.4)
        axon = Line(neuron.get_center() + RIGHT * 1.2, neuron.get_right() + RIGHT * 2.4, color=PALETTE["green"])
        pulse = Dot(color=PALETTE["red"]).move_to(axon.get_start())
        trail = VMobject(color=PALETTE["red"])
        trail.set_stroke(width=3, opacity=0.6)
        trail.set_points_as_corners([axon.get_start(), axon.get_start()])
        self.add(trail)
        self.play(Create(axon), FadeIn(pulse))
        self.play(
            MoveAlongPath(pulse, axon),
            UpdateFromFunc(trail, lambda t: t.set_points_as_corners([axon.get_start(), pulse.get_center()])),
            run_time=1.8,
        )

        ap_label = Text("Action potential", font="Georgia", color=PALETTE["red"]).scale(0.4)
        ap_label.next_to(axon, UP, buff=0.2)
        self.play(Write(ap_label))

        field_lines = VGroup()
        for offset in [0.4, 0.8, 1.2]:
            arc = Arc(radius=offset, start_angle=PI * 0.1, angle=PI * 0.8, color=PALETTE["blue"])
            arc.move_to(axon.get_end() + UP * 0.4)
            field_lines.add(arc)
        self.play(Create(field_lines))
        ampere_label = Text("Ampere's law: B field", font="Georgia", color=PALETTE["text"]).scale(0.4)
        ampere_label.next_to(field_lines, UP, buff=0.2)
        self.play(Write(ampere_label))
        self.wait(1.0)
        self.play(FadeOut(VGroup(neuron, membrane, membrane_label, ions, axon, pulse, trail, field_lines, ap_label, ampere_label)))


class NVDiamondScene(Scene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]

        diamond = RegularPolygon(n=4, color=PALETTE["gold"])
        diamond.scale(2.0)
        diamond.set_fill(PALETTE["gold"], opacity=0.08)

        levels = VGroup(
            Line(LEFT * 1.6, RIGHT * 1.6, color=PALETTE["text"]).shift(UP * 1.1),
            Line(LEFT * 1.6, RIGHT * 1.6, color=PALETTE["text"]).shift(UP * 0.3),
            Line(LEFT * 1.6, RIGHT * 1.6, color=PALETTE["text"]).shift(DOWN * 0.3),
            Line(LEFT * 1.6, RIGHT * 1.6, color=PALETTE["text"]).shift(DOWN * 1.1),
        )

        level_labels = VGroup(
            Text("m_s = +1", font="Georgia", color=PALETTE["red"]).scale(0.35),
            Text("m_s = 0", font="Georgia", color=PALETTE["green"]).scale(0.35),
            Text("m_s = 0", font="Georgia", color=PALETTE["green"]).scale(0.35),
            Text("m_s = -1", font="Georgia", color=PALETTE["red"]).scale(0.35),
        )
        for label, level in zip(level_labels, levels):
            label.next_to(level, RIGHT, buff=0.2)

        split_label = Text("Zeeman splitting", font="Georgia", color=PALETTE["text"]).scale(0.45)
        split_label.next_to(levels, UP, buff=0.25)

        arrows = VGroup(
            Arrow(levels[3].get_center(), levels[2].get_center(), color=PALETTE["green"], buff=0.1),
            Arrow(levels[2].get_center(), levels[1].get_center(), color=PALETTE["red"], buff=0.1),
            Arrow(levels[1].get_center(), levels[0].get_center(), color=PALETTE["red"], buff=0.1),
        )

        green_beam = Line(LEFT * 6, LEFT * 1.6, color=PALETTE["green"]).shift(DOWN * 0.6)
        red_beam = Line(RIGHT * 1.6, RIGHT * 6, color=PALETTE["red"]).shift(UP * 0.6)

        photon = Dot(color=PALETTE["gold"]).scale(0.6)
        photon.move_to(green_beam.get_start())

        electron = Dot(color=PALETTE["text"])
        electron.move_to(levels[2].get_center())
        magnetic_field = VGroup(
            Arrow(LEFT * 3.6 + DOWN * 1.6, LEFT * 3.6 + UP * 1.6, color=PALETTE["blue"], buff=0.1),
            Text("B", font="Georgia", color=PALETTE["blue"]).scale(0.4).next_to(LEFT * 3.6 + UP * 1.6, UP, buff=0.1),
        )

        self.play(FadeIn(diamond), FadeIn(levels), FadeIn(level_labels))
        self.play(Write(split_label), FadeIn(magnetic_field))
        self.wait(0.4)
        self.play(GrowArrow(arrows[0]), GrowArrow(arrows[1]), GrowArrow(arrows[2]))
        self.play(FadeIn(electron))
        self.play(Create(green_beam), Create(red_beam))
        self.play(photon.animate.move_to(green_beam.get_end()), run_time=1.0)
        self.play(electron.animate.move_to(levels[0].get_center()), run_time=0.8)
        self.play(photon.animate.move_to(red_beam.get_end()), run_time=1.0)
        self.play(electron.animate.move_to(levels[3].get_center()), run_time=0.8)
        self.wait(1.0)
        self.play(FadeOut(VGroup(diamond, levels, level_labels, split_label, arrows, green_beam, red_beam, photon, electron, magnetic_field)))


class PhotonicsScene(Scene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]

        waveguide = Rectangle(width=5.5, height=0.6, color=PALETTE["blue"])
        waveguide.set_fill(PALETTE["blue"], opacity=0.1)
        waveguide.shift(LEFT * 1.5)

        tir_rays = VGroup()
        for i in range(4):
            ray = Line(waveguide.get_left() + RIGHT * 0.6 * i + UP * 0.15, waveguide.get_left() + RIGHT * 0.6 * (i + 1) + DOWN * 0.15, color=PALETTE["red"])
            tir_rays.add(ray)

        output_beam = Line(waveguide.get_right(), RIGHT * 6, color=PALETTE["red"])
        chamber = RoundedRectangle(width=2.0, height=1.2, corner_radius=0.2, color=PALETTE["text"])
        chamber.set_fill(PALETTE["text"], opacity=0.04)
        chamber.move_to(output_beam.get_end() + RIGHT * 1.2)

        lens_left = Arc(radius=0.6, start_angle=-PI / 2, angle=PI, color=PALETTE["text"])
        lens_right = Arc(radius=0.6, start_angle=PI / 2, angle=PI, color=PALETTE["text"])
        lens = VGroup(lens_left, lens_right)
        lens.rotate(PI / 2)
        lens.next_to(chamber, RIGHT, buff=0.4)

        photodiode = Rectangle(width=0.9, height=0.9, color=PALETTE["gold"])
        photodiode.set_fill(PALETTE["gold"], opacity=0.2)
        photodiode.next_to(lens, RIGHT, buff=0.6)
        pd_label = Text("Photodiode", font="Georgia", color=PALETTE["text"]).scale(0.35)
        pd_label.next_to(photodiode, DOWN, buff=0.2)

        heatmap = self._make_heatmap().to_edge(DOWN, buff=0.6)
        cnn_graph = self._make_cnn_diagram().to_edge(UP, buff=0.6)
        analysis_label = Text("CNN", font="Times New Roman", color=PALETTE["text"]).scale(0.4)
        analysis_label.next_to(cnn_graph, RIGHT, buff=0.2)

        self.play(FadeIn(waveguide))
        self.play(LaggedStart(*[Create(ray) for ray in tir_rays], lag_ratio=0.15))
        self.play(Create(output_beam), FadeIn(chamber), FadeIn(lens), FadeIn(photodiode), Write(pd_label))
        self.play(FadeIn(heatmap), FadeIn(cnn_graph), Write(analysis_label))
        self.wait(1.3)
        self.play(FadeOut(VGroup(waveguide, tir_rays, output_beam, chamber, lens, photodiode, pd_label, heatmap, cnn_graph, analysis_label)))

    def _make_heatmap(self):
        grid = VGroup()
        for i in range(4):
            for j in range(6):
                cell = Square(side_length=0.35, color=PALETTE["text"], stroke_width=1)
                cell.set_fill(PALETTE["red"], opacity=0.1 + 0.1 * ((i + j) % 4))
                cell.shift(RIGHT * j * 0.38 + UP * i * 0.38)
                grid.add(cell)
        return grid

    def _make_cnn_diagram(self):
        input_grid = VGroup()
        for i in range(4):
            for j in range(4):
                cell = Square(side_length=0.22, color=PALETTE["text"], stroke_width=1)
                cell.set_fill(PALETTE["red"], opacity=0.08 + 0.04 * ((i + j) % 3))
                cell.shift(LEFT * 1.8 + RIGHT * j * 0.25 + UP * i * 0.25)
                input_grid.add(cell)

        conv1 = VGroup()
        for i in range(3):
            for j in range(3):
                cell = Square(side_length=0.22, color=PALETTE["text"], stroke_width=1)
                cell.set_fill(PALETTE["accent"], opacity=0.15)
                cell.shift(LEFT * 0.4 + RIGHT * j * 0.25 + UP * i * 0.25)
                conv1.add(cell)

        conv2 = VGroup()
        for i in range(2):
            for j in range(2):
                cell = Square(side_length=0.22, color=PALETTE["text"], stroke_width=1)
                cell.set_fill(PALETTE["gold"], opacity=0.2)
                cell.shift(RIGHT * 0.9 + RIGHT * j * 0.25 + UP * i * 0.25)
                conv2.add(cell)

        arrows = VGroup(
            Arrow(input_grid.get_right(), conv1.get_left(), color=PALETTE["text"], buff=0.1, stroke_width=2),
            Arrow(conv1.get_right(), conv2.get_left(), color=PALETTE["text"], buff=0.1, stroke_width=2),
        )

        return VGroup(input_grid, conv1, conv2, arrows)


class OutroScene(Scene):
    def construct(self):
        self.camera.background_color = PALETTE["bg"]
        closing = Text("Thank you", font="Times New Roman", color=PALETTE["text"])
        closing.scale(1.0)
        self.play(Write(closing))
        self.wait(1.5)
        self.play(FadeOut(closing))
